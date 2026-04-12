# Project Context: NutriFact Analyser

**Goal:** This document serves as a comprehensive "System Prompt" or Context Document for any AI assisting with the development, debugging, or scaling of the **NutriFact Analyser** project. It contains details about the project's architecture, tech stack, feature sets, and historical context.

---

## 1. Project Overview
**NutriFact Analyser** is a web-based, AI-driven health assistant built to help users make informed dietary choices. It achieves this by allowing users to upload images of either packaged food nutrition labels or physical raw meals. It then uses state-of-the-art vision AI to parse those images, estimate calorie counts, identify ingredients, and flag potential health hazards (e.g., high sugar, harmful additives, allergens).

## 2. Tech Stack Ecosystem
- **Frontend Framework:** React (using Functional Components and Hooks) + Vite for building.
- **Language:** TypeScript (`.tsx` / `.ts`), ensuring strict type safety.
- **Styling:** Vanilla CSS (`index.css`) with highly dynamic visual themes.
- **AI Integration:** Google Gemini API (specifically upgraded to `gemini-2.0-flash` to bypass free-tier resource exhaustion issues).
- **Backend/Database:** Supabase (using a PostgreSQL instance). Previously used local SQLite before migrating to support Vercel serverless functions / Railway cloud deployment.
- **Deployment Environments:** Vercel (frontend `nutriai.vercel.app`) / Railway.
- **Package Manager:** NPM (`package.json`, `package-lock.json`).

---

## 3. Directory & File Structure
```
/Users/kishore/StudioProjects/nutri-fact-analyser
├── App.tsx                    // Main routing and layout wrapper
├── index.html                 // Entry HTML point, handles "2026 nutri scan" branding
├── index.tsx                  // React DOM Render entry
├── vite.config.ts             // Vite configuration
├── tsconfig.json              // TypeScript compilation rules
├── components/                // Modular UI React Components
│   ├── AccountSettingsView.tsx// Handles user preferences & Theme switching bugs
│   ├── AnalysisView.tsx       // Manages Image parsing for Nutrition Labels
│   ├── AuthScreen.tsx         // Supabase Authentication GUI
│   ├── FoodScanView.tsx       // Manages visual scanning of physical food (newly added)
│   ├── HistoryView.tsx        // Displays past saved scan reports
│   ├── ImageUploader.tsx      // Core uploading logic with strict file input validation
│   ├── ProductReport.tsx      // Renders final nutritional data
│   ├── UserProfileEditor.tsx  // Profile updates
│   └── ProfileSelector.tsx    // Select between users/profiles
└── services/                  // Backend logic & external APIs
    ├── geminiService.ts       // Handles prompt engineering & Google Gemini Vision API calls
    ├── storageService.ts      // Local/Remote data saving abstraction
    └── supabase.ts            // Supabase client initialization and config
```

---

## 4. Key Application Features & Workflows

### A. Authentication
Handled via `AuthScreen.tsx` connecting to `supabase.ts`. Requires valid JWTs. Supabase acts as the primary source of truth for users.

### B. Label Scanning (`AnalysisView.tsx`)
1. User uploads an image of a nutrition label via `ImageUploader.tsx`.
2. Image is validated (checking for proper image types).
3. Payload is sent to `geminiService.ts` via the Google Gemini API.
4. Gemini extracts text (OCR) and formats the response as a JSON array of ingredients and calorie metrics.
5. The UI flags specific warnings (e.g., Carcinogens, High Sodium) and renders `ProductReport.tsx`.

### C. Raw Food Scanning (`FoodScanView.tsx`)
A newer architectural addition allowing users to skip a physical label and just photograph a meal (e.g. a plate of pasta). The AI conducts calorie estimation and portion assessment based purely on image classification. 

### D. History & Storage (`HistoryView.tsx` & `storageService.ts`)
Scans are saved persistently to the database (migrated from local SQLite/storage to Supabase/PostgreSQL) allowing returning users to track their historical calorie intake.

### E. Theming (`AccountSettingsView.tsx`)
The app utilizes dynamic state to inject theme variables (e.g. Dark Mode, Light Mode, Custom Colors). There have been historic bugs involving the persistence of chosen themes across different UI components, requiring careful React Context or local/Supabase storage synchronization.

---

## 5. Important Historical Context & Known Fixes
Any AI working on this base should keep the following recent architectural challenges in mind:

1. **Gemini Exhaustion:** Originally, the codebase utilized `gemini-3-pro-preview/gemini-1.5-pro`. It hit `RESOURCE_EXHAUSTED` (429 HTTP errors). The codebase was fixed by moving `.env` keys and officially switching to **`gemini-2.0-flash`**. *DO NOT revert the model.*
2. **Serverless Architecture Migration:** The project initially suffered from compatibility issues trying to deploy an Express+SQLite monolith onto Vercel. Architecture was overhauled to separate frontend (Vite -> Vercel) and Database (Postgres -> Railway / Supabase).
3. **UI/UX Resets:** The project domain is strictly `nutriai.vercel.app` and requires a specific, premium modern design. The homepage features a single-screen layout with all categories visible without scrolling.
4. **MCP Tooling:** The development environment uses the **Supabase MCP** to query and migrate the backend dynamically. Keep schema migrations in sync with Supabase constraints.

---

## 6. Development Workflow (For AI)
- **Start the app:** Use `npm run dev`.
- **Database changes:** Ensure any new tables are synced with Supabase via the Supabase MCP.
- **Debugging API:** If AI parsing fails, check `geminiService.ts` for malformed prompts. Vision API requires Base64 image encoding or public URLs.
- **Styling updates:** Do NOT use Tailwind unless explicitly asked; this project relies on vanilla CSS architecture located in `index.css` and modular component logic to maintain its "wow" factor aesthetics.

*End of Document*
