const express = require('express');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const app = express();
// Paddle sends data as x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize Supabase Admin Client
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Verifies the Paddle Webhook Signature.
 * Paddle Classic uses OpenSSL verification of the serialized parameters.
 */
const verifyPaddleSignature = (req) => {
  const pubKey = process.env.PADDLE_PUBLIC_KEY;
  if (!pubKey) return true; // Bypass if key not set (Dev mode)

  const signature = req.body.p_signature;
  if (!signature) return false;

  // 1. Get all fields except p_signature
  const keys = Object.keys(req.body).filter(k => k !== 'p_signature').sort();

  // 2. Serialize (PHP Serialization Emulation)
  // Note: For production, use a library like 'php-serialize' or 'paddle-sdk'
  // This is a simplified serialization for demonstration.
  let serialized = `a:${keys.length}:{`;
  keys.forEach(k => {
    const val = req.body[k];
    serialized += `s:${Buffer.byteLength(k)}:"${k}";s:${Buffer.byteLength(val)}:"${val}";`;
  });
  serialized += '}';

  // 3. Verify using SHA1
  const verifier = crypto.createVerify('sha1');
  verifier.update(serialized);
  
  // Ensure public key is formatted correctly
  const formattedKey = pubKey.includes('BEGIN PUBLIC KEY') 
    ? pubKey 
    : `-----BEGIN PUBLIC KEY-----\n${pubKey}\n-----END PUBLIC KEY-----`;

  return verifier.verify(formattedKey, signature, 'base64');
};

app.post('/webhook', async (req, res) => {
  try {
    // 1. Security Check
    if (!verifyPaddleSignature(req)) {
      console.error('Invalid Paddle Signature');
      return res.status(401).send('Invalid signature');
    }

    const { alert_name, passthrough, subscription_id, email } = req.body;
    
    // We assume 'passthrough' contains the Organization ID or User ID
    const targetId = passthrough; 
    
    console.log(`[Paddle] Event: ${alert_name} | Target: ${targetId}`);

    let updateData = {};

    // 2. Map Events to DB Updates
    switch (alert_name) {
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_payment_succeeded':
        updateData = {
          plan_type: 'enterprise', // In prod, map req.body.subscription_plan_id to specific tiers
          is_active: true,
          paddle_subscription_id: subscription_id,
          paddle_customer_id: req.body.user_id,
          updated_at: new Date().toISOString()
        };
        break;

      case 'subscription_cancelled':
        updateData = {
          is_active: false,
          plan_type: 'free',
          updated_at: new Date().toISOString()
        };
        break;
        
      case 'subscription_payment_failed':
        updateData = {
            is_active: false,
            subscription_status: 'past_due'
        };
        break;
    }

    // 3. Update 'organizations' table
    if (Object.keys(updateData).length > 0 && targetId) {
        
        // Try updating Organization first
        const { error: orgError } = await supabase
            .from('organizations')
            .update(updateData)
            .eq('id', targetId);

        if (orgError) {
            console.warn(`Org update failed (ID might be a Profile ID?): ${orgError.message}`);
            
            // Fallback: Update Profile if it's a User ID
            await supabase.from('profiles').update({
                subscription_status: updateData.is_active ? 'active' : 'canceled',
                tier: updateData.plan_type === 'enterprise' ? 'ENTERPRISE' : 'FREE',
                customerId: req.body.user_id
            }).eq('id', targetId);
        } else {
            console.log(`Successfully updated organization ${targetId}`);
        }
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook Error:', err);
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Paddle Webhook listening on port ${PORT}`));