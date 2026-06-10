# Academic Pathway Engine (Internship Challenge)

A simple, clean, reliable, and premium scoring-based academic recommender designed to evaluate academic backgrounds, current professions, and long-term research or management aspirations and align them with structured higher education opportunities.

---

## 🚀 Deployment Info
- **Tech Stack:** React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion (for transitions) + Supabase database
- **Storage:** Supabase database integration with a seamless zero-config local storage fallback.
- **Visuals:** Modern humanist typography utilizing Google Plus Jakarta Sans and JetBrains Mono.

---

## 🛠️ Folder Structure
Our modular, scalable structure separates data, types, algorithm helpers, and interactive layouts:
```text
src/
├── components/
│   ├── Navbar.tsx             # Responsive header navigation
│   ├── UserForm.tsx           # Form with client validate schemas, state & focus cues
│   ├── RecommendationCard.tsx # Detailed recommendation & pathway highlights card
│   └── LoadingSpinner.tsx     # Custom async visual loading queues
├── pages/
│   ├── Home.tsx               # Academic Form questionnaire hub coordinates
│   └── Submissions.tsx        # Candidate admissions log & analytics distribution panels
├── services/
│   ├── supabase.ts            # Supabase database integration & localStorage fallback client
│   └── recommendationEngine.ts # Advanced rule-weighted scoring algorithm matrix
├── types.ts                   # Unified types & model interface declarations
├── main.tsx                   # Index bundle script entry point
├── App.tsx                    # Client-side router & navbar skeletal frame
└── index.css                  # Tailwind global import & custom display theme pairings
```

---

## ⚙️ Setup & Installation

Get the application up and running locally in a few quick steps.

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 2. Install Dependencies
Clone the repository, navigate into the project directory, and install the required npm packages:
```bash
npm install
```

### 3. Environment Configuration
The application supports a **zero-config mode** by default. If no environment variables are provided:
- It falls back to storing submissions in `localStorage` instead of Supabase.
- It disables the Gemini AI option gracefully or prompts for a key when chosen, utilizing the rule-weighted scoring matrix.

To connect to a live database and enable the Gemini AI Engine option:
1. Copy the example environment file to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and replace the placeholder values with your actual credentials:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"

   # Gemini API Configuration
   VITE_GEMINI_API_KEY="your-gemini-api-key"
   ```

#### 🗄️ Supabase Table Schema Setup
If using a live database, create a table named `submissions` with the following columns:
- `id` (UUID or Text, Primary Key, auto-generated)
- `created_at` (Timestamp with timezone, default `now()`)
- `full_name` (Text, not null)
- `email` (Text, not null)
- `qualification` (Text, not null)
- `experience` (Numeric/Integer, not null)
- `profession` (Text, not null)
- `career_goal` (Text, not null)
- `recommendation` (Text, not null)
- `reason` (Text, not null)

*Note: For security, configure Row-Level Security (RLS) on the table to only permit `INSERT` and `SELECT` operations, blocking `UPDATE` and `DELETE` operations.*

### 4. Running the Development Server
Launch the local development server (runs on port `3000` by default):
```bash
npm run dev
```
Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Building for Production
To generate a compiled, production-ready build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 📐 Rule-Based scoring Algorithm
Rather than a basic heuristic string matches sequence, the `recommendationEngine.ts` computes weights through a robust **Scoring Matrix**:
1. **Goal Analysis Weights:** Maps expressions targeting "research", "teaching", "r&d" to PhD (+6); and "leadership", "management", "c-suite" to DBA (+5).
2. **Experience Indicators:** Awards higher DBA scores if years are >= 8 (+5) and shifts candidates to Honorary Doctorate pathways if work history exceeds 15 years (+8).
3. **Boundary Qualification Checkers:** Strictly checks feasibility (e.g. restricts PhD holders from repeating undergraduate studies, and verifies requirements for High School/Diploma entries).

---

## 🔒 Security Hardening
Our backend database is designed with safety principles to prevent:
- **Shadow Updates:** Submissions are fully immutable once created (allow read/create only, updates/deletes are strictly denied via Row-Level Security policies).
- **Identity Poisoning:** Document ID and constraints block arbitrary massive payload injections.
- **Data Invariants:** A strict validation blueprint ensures that fields like `experience` reside exclusively within logical margins (0–100) and qualifications match expected choices.
