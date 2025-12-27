# ArtisanPass 🧶
**The Offline-First Traceability Engine for the Global Artisan Economy**

## 🌍 The Mission
ArtisanPass bridges the gap between remote artisans in the Global South and compliance-heavy markets in the EU. 

With new regulations like the **EU Digital Product Passport (DPP)** coming into effect, millions of rural artisans risk being cut off from global supply chains due to lack of data infrastructure.

**ArtisanPass solves this by:**
1.  **Democratizing Compliance:** Using Voice AI and Image Recognition to log traceability data without complex forms.
2.  **Bridging Connectivity:** A robust "Offline-First" architecture that syncs when connection is available.
3.  **Visual Proof:** Generating verifiable Digital Passports (QR codes) that prove authenticity and sustainability.

## 🛠️ Tech Stack
-   **Frontend:** React (SPA), Tailwind CSS, Recharts.
-   **AI Core:** Google Gemini 2.5/3.0 (Multimodal analysis of materials and voice).
-   **Data:** Supabase (PostgreSQL), IndexedDB (Local caching).
-   **Architecture:** PWA (Progressive Web App) for installation on low-end devices.

## 🚀 How to Run
1.  `npm install`
2.  Create `.env` with `API_KEY` (Gemini) and `NEXT_PUBLIC_SUPABASE_URL`.
3.  `npm run dev`

## 🔮 Roadmap
-   [x] Material Intake (Voice/Vision)
-   [x] Creation Logging
-   [x] EU DPP Generation
-   [ ] Blockchain anchoring of DPPs
-   [ ] Direct Marketplace Integration

---
*Built with ❤️ for the makers.*