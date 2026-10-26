"""
RADIX Talent Match seed importer.

Usage:
    pip install -r requirements.txt
    python seed_data.py --file data/hackathon_data.json

Notes:
- Uses the Supabase service-role key on the server only.
- Does not invent candidates, JDs, extracted skills, or company expectations.
- Requires candidate records to include an existing Supabase Auth user_id,
  because candidate_profiles.user_id references auth.users(id).
- Import is designed for a trusted local/dev environment. Review records before production use.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from supabase import Client, create_client


RADIX_CATEGORIES = {
    "COD", "DSA", "OOD", "APTI", "COMM", "AI", "CLOUD",
    "SQL", "SWE", "SYSD", "NETW", "OS", "OTHER",
}
PROFICIENCY_LEVELS = {"beginner", "intermediate", "advanced", "expert"}


def require_text(value: Any, field: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"Required field '{field}' must be a non-empty string.")
    return value.strip()


def validate_category(value: Any, field: str = "skill_category") -> str:
    category = require_text(value, field).upper()
    if category not in RADIX_CATEGORIES:
        raise ValueError(
            f"Invalid {field} '{category}'. Expected one of: {', '.join(sorted(RADIX_CATEGORIES))}"
        )
    return category


def normalized_skill(name: str) -> str:
    return " ".join(name.strip().lower().split())


def chunks(items: list[dict[str, Any]], size: int = 100):
    for start in range(0, len(items), size):
        yield items[start:start + size]


def insert_rows(client: Client, table: str, rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Insert in chunks and return inserted rows. Empty lists are ignored."""
    if not rows:
        return []
    inserted: list[dict[str, Any]] = []
    for batch in chunks(rows):
        response = client.table(table).insert(batch).execute()
        inserted.extend(response.data or [])
    print(f"  Inserted {len(inserted)} row(s) into {table}")
    return inserted


def upsert_expectations(client: Client, rows: list[dict[str, Any]]) -> None:
    if not rows:
        print("  No company expectations supplied; skipped.")
        return
    # The base schema has UNIQUE(company_name, role_name, normalized_skill_name).
    for row in rows:
        row["company_name"] = require_text(row.get("company_name"), "company_name")
        row["role_name"] = require_text(row.get("role_name"), "role_name")
        row["skill_name"] = require_text(row.get("skill_name"), "skill_name")
        row["normalized_skill_name"] = normalized_skill(row["skill_name"])
        row["skill_category"] = validate_category(row.get("skill_category"))
        row["source"] = require_text(row.get("source"), "source")
        if row.get("expected_level") is not None and row["expected_level"] not in PROFICIENCY_LEVELS:
            raise ValueError(f"Invalid expected_level: {row['expected_level']}")
        if row.get("importance_weight") is None:
            row["importance_weight"] = 1
    for batch in chunks(rows):
        client.table("company_skill_expectations").upsert(
            batch,
            on_conflict="company_name,role_name,normalized_skill_name",
        ).execute()
    print(f"  Upserted {len(rows)} row(s) into company_skill_expectations")


def seed_candidates(client: Client, candidates: list[dict[str, Any]]) -> dict[str, str]:
    """
    Inserts candidate parent rows and related rows.
    Each candidate must contain user_id for an existing auth.users record.
    """
    candidate_ids: dict[str, str] = {}

    for candidate in candidates:
        external_key = require_text(candidate.get("key"), "candidate.key")
        profile = candidate.get("profile", {})
        user_id = require_text(profile.get("user_id"), f"{external_key}.profile.user_id")

        profile_row = {
            "user_id": user_id,
            "full_name": require_text(profile.get("full_name"), f"{external_key}.profile.full_name"),
            "email": profile.get("email"),
            "phone": profile.get("phone"),
            "location": profile.get("location"),
            "education": profile.get("education", []),
            "graduation_year": profile.get("graduation_year"),
            "linkedin_url": profile.get("linkedin_url"),
            "github_url": profile.get("github_url"),
            "portfolio_url": profile.get("portfolio_url"),
            "resume_file_path": profile.get("resume_file_path"),
        }

        # The schema has one profile per auth user. If it already exists, reuse it.
        existing = (
            client.table("candidate_profiles")
            .select("id,user_id")
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        ).data or []

        if existing:
            profile_id = existing[0]["id"]
            print(f"  Reusing candidate profile for {external_key}: {profile_id}")
        else:
            created = client.table("candidate_profiles").insert(profile_row).execute().data or []
            if not created:
                raise RuntimeError(f"Could not create candidate profile for key '{external_key}'.")
            profile_id = created[0]["id"]
            print(f"  Created candidate profile for {external_key}: {profile_id}")

        candidate_ids[external_key] = profile_id

        # Idempotent-ish import: remove current child rows before reimporting this seed record.
        # Use only for controlled seed/dev datasets, not as a general user-data sync strategy.
        for table in (
            "candidate_skills", "candidate_projects",
            "candidate_experiences", "candidate_certifications"
        ):
            client.table(table).delete().eq("candidate_id", profile_id).execute()

        skills = []
        for item in candidate.get("skills", []):
            name = require_text(item.get("skill_name"), "skills.skill_name")
            category = validate_category(item.get("skill_category"))
            level = item.get("proficiency_level")
            if level is not None and level not in PROFICIENCY_LEVELS:
                raise ValueError(f"Invalid proficiency_level '{level}' for skill '{name}'.")
            skills.append({
                "candidate_id": profile_id,
                "skill_name": name,
                "normalized_skill_name": normalized_skill(name),
                "skill_category": category,
                "proficiency_level": level,
                "years_of_experience": item.get("years_of_experience"),
                "evidence": item.get("evidence", []),
                "source": item.get("source", "resume"),
            })
        insert_rows(client, "candidate_skills", skills)

        projects = []
        for item in candidate.get("projects", []):
            projects.append({
                "candidate_id": profile_id,
                "project_name": require_text(item.get("project_name"), "projects.project_name"),
                "description": item.get("description"),
                "technologies": item.get("technologies", []),
                "project_url": item.get("project_url"),
                "start_date": item.get("start_date"),
                "end_date": item.get("end_date"),
                "source": item.get("source", "resume"),
            })
        insert_rows(client, "candidate_projects", projects)

        experiences = []
        for item in candidate.get("experiences", []):
            experiences.append({
                "candidate_id": profile_id,
                "company_name": require_text(item.get("company_name"), "experiences.company_name"),
                "job_title": require_text(item.get("job_title"), "experiences.job_title"),
                "description": item.get("description"),
                "technologies": item.get("technologies", []),
                "start_date": item.get("start_date"),
                "end_date": item.get("end_date"),
                "is_current": item.get("is_current", False),
            })
        insert_rows(client, "candidate_experiences", experiences)

        certifications = []
        for item in candidate.get("certifications", []):
            certifications.append({
                "candidate_id": profile_id,
                "title": require_text(item.get("title"), "certifications.title"),
                "issuing_organization": item.get("issuing_organization"),
                "issue_date": item.get("issue_date"),
                "expiry_date": item.get("expiry_date"),
                "credential_url": item.get("credential_url"),
            })
        insert_rows(client, "candidate_certifications", certifications)

    return candidate_ids


def seed_job_descriptions(client: Client, jobs: list[dict[str, Any]]) -> dict[str, str]:
    job_ids: dict[str, str] = {}

    for job in jobs:
        key = require_text(job.get("key"), "job.key")
        row = {
            "created_by": job.get("created_by"),  # Must be an existing auth user ID or null.
            "company_name": require_text(job.get("company_name"), f"{key}.company_name"),
            "job_title": require_text(job.get("job_title"), f"{key}.job_title"),
            "job_location": job.get("job_location"),
            "employment_type": job.get("employment_type"),
            "description_text": require_text(job.get("description_text"), f"{key}.description_text"),
            "source_type": job.get("source_type", "pasted_text"),
            "file_path": job.get("file_path"),
            "analysis_status": job.get("analysis_status", "pending"),
            "analysis_error": job.get("analysis_error"),
        }
        if row["source_type"] not in {"pdf", "docx", "pasted_text"}:
            raise ValueError(f"Invalid source_type for job '{key}'.")
        if row["analysis_status"] not in {"pending", "processing", "completed", "failed"}:
            raise ValueError(f"Invalid analysis_status for job '{key}'.")

        # Insert a new JD. Running the same file twice can create duplicate JDs.
        created = client.table("job_descriptions").insert(row).execute().data or []
        if not created:
            raise RuntimeError(f"Could not create job description '{key}'.")
        job_id = created[0]["id"]
        job_ids[key] = job_id
        print(f"  Created job description {key}: {job_id}")

        required_skills = []
        for item in job.get("skills", []):
            name = require_text(item.get("skill_name"), "job.skills.skill_name")
            category = validate_category(item.get("skill_category"))
            requirement_type = item.get("requirement_type", "required")
            if requirement_type not in {"required", "preferred", "soft_skill"}:
                raise ValueError(f"Invalid requirement_type '{requirement_type}' for '{name}'.")
            confidence = item.get("confidence")
            if confidence is not None and not (0 <= float(confidence) <= 1):
                raise ValueError(f"Confidence must be between 0 and 1 for skill '{name}'.")
            level = item.get("required_level")
            if level is not None and level not in PROFICIENCY_LEVELS:
                raise ValueError(f"Invalid required_level '{level}' for skill '{name}'.")
            required_skills.append({
                "job_description_id": job_id,
                "skill_name": name,
                "normalized_skill_name": normalized_skill(name),
                "skill_category": category,
                "requirement_type": requirement_type,
                "required_level": level,
                "importance_weight": item.get("importance_weight"),
                "evidence_text": require_text(item.get("evidence_text"), "job.skills.evidence_text"),
                "confidence": confidence,
            })
        insert_rows(client, "job_required_skills", required_skills)

    return job_ids


def load_data(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, dict):
        raise ValueError("Top-level JSON must be an object.")
    for key in ("candidates", "job_descriptions", "company_skill_expectations"):
        if key not in data or not isinstance(data[key], list):
            raise ValueError(f"JSON must contain a list named '{key}'.")
    return data


def main() -> int:
    parser = argparse.ArgumentParser(description="Import RADIX Talent Match sample data into Supabase.")
    parser.add_argument("--file", default="data/hackathon_data.json", help="Path to the dataset JSON file.")
    args = parser.parse_args()

    load_dotenv(Path(__file__).resolve().parent / ".env")
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        print(
            "Configuration missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY "
            "in backend/.env. Do not put the service-role key in frontend code.",
            file=sys.stderr,
        )
        return 2

    data_path = Path(args.file)
    if not data_path.is_absolute():
        data_path = Path(__file__).resolve().parent / data_path
    if not data_path.exists():
        print(f"Data file not found: {data_path}", file=sys.stderr)
        return 2

    try:
        data = load_data(data_path)
        client = create_client(url, key)

        print("Importing candidates and related records...")
        seed_candidates(client, data["candidates"])

        print("Importing job descriptions and supplied/verified skill records...")
        seed_job_descriptions(client, data["job_descriptions"])

        print("Importing company skill expectations...")
        expectations = data["company_skill_expectations"]
        for item in expectations:
            if item.get("source") in (None, ""):
                # Require an explicit source label; don't silently claim data is official.
                raise ValueError(
                    "Every company expectation must have an explicit source label, "
                    "such as the actual filename or 'development_fixture'."
                )
        upsert_expectations(client, expectations)

        print("\nImport completed.")
        print(f"Candidates processed: {len(data['candidates'])}")
        print(f"Job descriptions created: {len(data['job_descriptions'])}")
        print(f"Company expectation rows processed: {len(expectations)}")
        print("Assessment result tables are intentionally not seeded; generate real results through the app.")
        return 0
    except Exception as exc:
        print(f"\nImport failed: {exc}", file=sys.stderr)
        print(
            "Check the row data, foreign keys, RLS/schema, and Supabase credentials. "
            "The script is not a single transaction; earlier successful inserts may remain.",
            file=sys.stderr,
        )
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
