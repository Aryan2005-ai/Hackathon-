# RADIX Talent Match — Combined Backend + Sample Data

This folder combines the FastAPI backend starter, sample data importer, sample JSON data, and Supabase SQL scripts. Copy this entire `backend` folder into the root of your existing frontend project (next to `package.json`). It does not replace the frontend.

## Folder contents

- `app/` — FastAPI application and placeholder feature routes/services.
- `seed_data.py` — imports sample candidate, job description, and company skill expectation data into Supabase.
- `data/hackathon_data.json` — populated sample data based on the four uploaded resume PDFs and six uploaded job descriptions.
- `data/hackathon_data.template.json` — blank/template structure for editing or creating other sample data.
- `database/01_radix_talent_match_schema.sql` — base database tables and indexes.
- `database/02_triggers_checks.sql` — updated-at triggers, normalization, and constraints.

## 1. Set up Python (Windows PowerShell)

From your project root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

If PowerShell blocks activation, use Command Prompt and run `.venv\\Scripts\\activate.bat` instead.

## 2. Configure Supabase

Copy `.env.example` to `.env` inside this `backend` folder and enter your own values:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_SIDE_SERVICE_ROLE_KEY
LLM_API_KEY=YOUR_LLM_API_KEY
```

Keep `.env` private. Never put the service-role key in frontend code or commit it to GitHub. The LLM key is not needed to run the health endpoints or the sample-data importer.

## 3. Create database tables

In Supabase, open **SQL Editor**. If the RADIX tables do not exist, run `database/01_radix_talent_match_schema.sql` first, then `database/02_triggers_checks.sql`.

Do not blindly rerun table-creation SQL if tables already exist. Review the existing schema first, especially if your app already has similarly named tables. These scripts add RADIX-specific tables; they are not intended to replace existing company-intelligence or roadmap tables.

## 4. Create test Auth users

The schema links `candidate_profiles.user_id` to Supabase Auth users. Create four test users in Supabase Authentication, then copy their actual UUIDs. In `data/hackathon_data.json`, replace:

- `REPLACE_WITH_AUTH_UUID_FOR_ANANYA`
- `REPLACE_WITH_AUTH_UUID_FOR_KARTHIK`
- `REPLACE_WITH_AUTH_UUID_FOR_PRIYA`
- `REPLACE_WITH_AUTH_UUID_FOR_ROHAN`

with the corresponding existing Auth UUIDs. Do not use these placeholder strings as-is. The importer does not create Auth users.

## 5. Import sample data

With the virtual environment active and `.env` configured, run:

```powershell
python seed_data.py --file data/hackathon_data.json
```

The sample data is intended for development/testing. Skill lists and job requirements are extracted/structured from the provided sample resumes and JDs; review them before treating them as verified hiring criteria. No Talent Check or Skill Matching result is fabricated by the importer.

**Rerun warning:** candidate child rows are replaced for the matching user IDs, while job descriptions are inserted as new rows on each run and may duplicate. Avoid rerunning unless you intend that behavior or have cleaned up prior test rows.

## 6. Run the backend

From inside `backend`:

```powershell
python -m uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000/health` and `http://127.0.0.1:8000/docs`.

## Current feature status

The server health routes run, but JD Analytics, resume parsing, profile builder, talent check, and skill matching are scaffold placeholders at this stage. They do not yet implement real analysis and must not be treated as complete features. Implement and test them before using real candidate data.
