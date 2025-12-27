# 🛡️ ArtisanPass Deployment Checklist

## 1. Database Security (Supabase)
- [ ] **Row Level Security (RLS):** Ensure RLS is ENABLED on all tables (`logs`, `products`, `materials`).
    - *Policy:* `Users can only insert/select their own device_id or auth.uid`.
- [ ] **Disable Public Access:** Ensure no tables are "Public" (World readable) unless intended (e.g., `public_tracking` read-only).
- [ ] **API Keys:** Check that `NEXT_PUBLIC_SUPABASE_ANON_KEY` has restricted privileges.

## 2. Environment Variables
- [ ] **Production Keys:** Ensure `API_KEY` (Gemini) and Supabase keys are set in Vercel Project Settings.
- [ ] **Build Command:** Vercel Build Command should be `vite build`.
- [ ] **Output Directory:** Vercel Output Directory should be `dist`.

## 3. Data Integrity & Backups
- [ ] **PITR (Point-in-Time Recovery):** Enable Point-in-Time Recovery in Supabase Pro settings for the `logs` table to prevent data loss during sync conflicts.
- [ ] **SSL Enforcement:** Supabase enforces SSL by default. Ensure your frontend makes requests to `https://`.

## 4. PWA Validation
- [ ] **HTTPS:** Service Workers only register over HTTPS (Vercel provides this by default).
- [ ] **Asset Caching:** Verify `sw.js` is caching `cdn.tailwindcss.com` to prevent unstyled offline pages.

## 5. EU Compliance (DPP)
- [ ] **Data Residency:** If scaling to EU enterprise customers, ensure Supabase region is set to `eu-central-1` (Frankfurt) or similar.
- [ ] **Data Export:** Verify the "Export Report" feature generates valid text/PDF formats readable by regulators.