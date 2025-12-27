
// @ts-ignore
declare const Deno: any;

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase Client (Admin Context)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse the incoming record (Webhook payload or direct API body)
    const { record } = await req.json()
    
    if (!record || !record.gps) {
        throw new Error("Missing record or GPS data")
    }

    const { lat, lng, isManual, is_mocked } = record.gps
    const userId = record.user_id // Assumes user_id is attached to the log
    const logId = record.id

    let fraudScore = 0
    const reasons: string[] = []

    // --- CHECK 1: MOCK LOCATION (CRITICAL) ---
    // Checks if the device reports that a mock location provider is being used
    if (isManual || is_mocked) {
        fraudScore += 100
        reasons.push("GPS Mock/Manual Entry Detected")
    }

    // --- CHECK 2: DISTANCE FROM HOME FACILITY ---
    // Fetches the artisan's profile to find their registered workshop location
    if (userId) {
        const { data: profile } = await supabaseClient
            .from('profiles')
            .select('home_lat, home_lng')
            .eq('id', userId)
            .single()

        if (profile && profile.home_lat && profile.home_lng) {
            const distHome = getDistanceFromLatLonInKm(lat, lng, profile.home_lat, profile.home_lng)
            if (distHome > 2) { // 2km tolerance
                fraudScore += 40
                reasons.push(`Location Deviation (>2km from Home: ${distHome.toFixed(2)}km)`)
            }
        }
    }

    // --- CHECK 3: IMPOSSIBLE SPEED (TELEPORTATION) ---
    // Fetches the most recent previous log to calculate travel speed
    if (userId) {
        const { data: lastLog } = await supabaseClient
            .from('logs')
            .select('timestamp, gps')
            .eq('user_id', userId)
            .neq('id', logId) // Exclude current log
            .order('timestamp', { ascending: false })
            .limit(1)
            .single()

        if (lastLog && lastLog.gps) {
            const prevTime = new Date(lastLog.timestamp).getTime()
            const currTime = new Date(record.timestamp || Date.now()).getTime()
            const hoursDiff = (currTime - prevTime) / (1000 * 60 * 60) // Hours

            // Only calculate if logs are chronologically distinct
            if (hoursDiff > 0.01) { 
                const distPrev = getDistanceFromLatLonInKm(lat, lng, lastLog.gps.lat, lastLog.gps.lng)
                const speed = distPrev / hoursDiff

                if (speed > 100) { // Speed limit 100km/h
                    fraudScore += 50
                    reasons.push(`Impossible Travel Speed (${speed.toFixed(0)} km/h)`)
                }
            }
        }
    }

    // --- ACTION: FLAGGING & ALERTING ---
    let isFlagged = false
    if (fraudScore >= 80) {
        isFlagged = true
        
        // 1. Update the Record in DB
        await supabaseClient
            .from('logs')
            .update({ 
                fraud_score: fraudScore, 
                is_flagged: true,
                flag_reason: reasons.join(', ')
            })
            .eq('id', logId)

        // 2. Mock Email Alert System (In prod, use Resend or SendGrid)
        console.log(`[ALERT] HIGH FRAUD RISK (${fraudScore}) detected for User ${userId}. Reasons: ${reasons.join(', ')}`)
    } else {
         // Just record the score
         await supabaseClient
            .from('logs')
            .update({ 
                fraud_score: fraudScore, 
                is_flagged: false 
            })
            .eq('id', logId)
    }

    return new Response(JSON.stringify({ success: true, fraudScore, isFlagged, reasons }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Fraud Detection Error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

// --- HELPER: HAVERSINE FORMULA ---
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1);  
  const dLon = deg2rad(lon2-lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}
