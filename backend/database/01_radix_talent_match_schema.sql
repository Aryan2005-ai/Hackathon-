-- RADIX Talent Match: Supabase PostgreSQL schema
-- Run in Supabase SQL Editor after checking for existing tables.
-- This script creates the 10 proposed application tables.
-- It assumes Supabase Auth is enabled (auth.users exists).

begin;

create extension if not exists pgcrypto;

-- 1. Candidate profiles
create table if not exists public.candidate_profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null unique references auth.users(id) on delete cascade,
    full_name text not null,
    email text,
    phone text,
    location text,
    education jsonb not null default '[]'::jsonb,
    graduation_year integer check (graduation_year is null or graduation_year between 1950 and 2150),
    linkedin_url text,
    github_url text,
    portfolio_url text,
    resume_file_path text,
    professional_summary text,
    career_preferences jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 1b. Candidate education
create table if not exists public.candidate_education (
    id uuid primary key default gen_random_uuid(),
    candidate_id uuid not null references public.candidate_profiles(id) on delete cascade,
    institution_name text not null,
    degree text not null,
    field_of_study text,
    start_date date,
    graduation_date date,
    cgpa_percentage text,
    relevant_coursework text,
    achievements text,
    created_at timestamptz not null default now()
);

-- 2. Candidate skills
create table if not exists public.candidate_skills (
    id uuid primary key default gen_random_uuid(),
    candidate_id uuid not null references public.candidate_profiles(id) on delete cascade,
    skill_name text not null,
    normalized_skill_name text not null,
    skill_category text not null check (
        skill_category in ('COD','DSA','OOD','APTI','COMM','AI','CLOUD','SQL','SWE','SYSD','NETW','OS','OTHER')
    ),
    proficiency_level text check (
        proficiency_level is null or proficiency_level in ('beginner','intermediate','advanced','expert')
    ),
    years_of_experience numeric(5,2) check (years_of_experience is null or years_of_experience >= 0),
    evidence jsonb not null default '[]'::jsonb,
    source text not null default 'manual' check (source in ('resume','manual','assessment')),
    created_at timestamptz not null default now(),
    unique (candidate_id, normalized_skill_name)
);

-- 3. Candidate projects
create table if not exists public.candidate_projects (
    id uuid primary key default gen_random_uuid(),
    candidate_id uuid not null references public.candidate_profiles(id) on delete cascade,
    project_name text not null,
    description text,
    technologies jsonb not null default '[]'::jsonb,
    project_url text,
    start_date date,
    end_date date,
    source text not null default 'manual' check (source in ('resume','manual')),
    created_at timestamptz not null default now(),
    check (start_date is null or end_date is null or end_date >= start_date)
);

-- 4. Candidate experiences
create table if not exists public.candidate_experiences (
    id uuid primary key default gen_random_uuid(),
    candidate_id uuid not null references public.candidate_profiles(id) on delete cascade,
    company_name text not null,
    job_title text not null,
    description text,
    technologies jsonb not null default '[]'::jsonb,
    start_date date,
    end_date date,
    is_current boolean not null default false,
    created_at timestamptz not null default now(),
    check (start_date is null or end_date is null or end_date >= start_date),
    check (is_current = false or end_date is null)
);

-- 5. Candidate certifications / achievements
create table if not exists public.candidate_certifications (
    id uuid primary key default gen_random_uuid(),
    candidate_id uuid not null references public.candidate_profiles(id) on delete cascade,
    title text not null,
    issuing_organization text,
    issue_date date,
    expiry_date date,
    credential_url text,
    created_at timestamptz not null default now(),
    check (issue_date is null or expiry_date is null or expiry_date >= issue_date)
);

-- 6. Job descriptions
create table if not exists public.job_descriptions (
    id uuid primary key default gen_random_uuid(),
    created_by uuid references auth.users(id) on delete set null,
    company_name text not null,
    job_title text not null,
    job_location text,
    employment_type text,
    description_text text not null,
    source_type text not null check (source_type in ('pdf','docx','pasted_text')),
    file_path text,
    analysis_status text not null default 'pending'
        check (analysis_status in ('pending','processing','completed','failed')),
    analysis_error text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 7. Skills extracted from each job description
create table if not exists public.job_required_skills (
    id uuid primary key default gen_random_uuid(),
    job_description_id uuid not null references public.job_descriptions(id) on delete cascade,
    skill_name text not null,
    normalized_skill_name text not null,
    skill_category text not null check (
        skill_category in ('COD','DSA','OOD','APTI','COMM','AI','CLOUD','SQL','SWE','SYSD','NETW','OS','OTHER')
    ),
    requirement_type text not null default 'required'
        check (requirement_type in ('required','preferred','soft_skill')),
    required_level text check (
        required_level is null or required_level in ('beginner','intermediate','advanced','expert')
    ),
    importance_weight numeric(6,3) check (importance_weight is null or importance_weight >= 0),
    evidence_text text not null,
    confidence numeric(4,3) check (confidence is null or confidence between 0 and 1),
    created_at timestamptz not null default now(),
    unique (job_description_id, normalized_skill_name, requirement_type)
);

-- 8. Company / role skill expectations used by Talent Check.
-- Load the official hackathon dataset into this table; do not treat sample
-- fixtures or unverified assumptions as official company requirements.
create table if not exists public.company_skill_expectations (
    id uuid primary key default gen_random_uuid(),
    company_name text not null,
    role_name text not null,
    skill_name text not null,
    normalized_skill_name text not null,
    skill_category text not null check (
        skill_category in ('COD','DSA','OOD','APTI','COMM','AI','CLOUD','SQL','SWE','SYSD','NETW','OS','OTHER')
    ),
    expected_level text check (
        expected_level is null or expected_level in ('beginner','intermediate','advanced','expert')
    ),
    importance_weight numeric(6,3) not null default 1 check (importance_weight >= 0),
    source text not null,
    source_version text,
    created_at timestamptz not null default now(),
    unique (company_name, role_name, normalized_skill_name)
);

-- 9. Talent Check assessment history
create table if not exists public.talent_check_results (
    id uuid primary key default gen_random_uuid(),
    candidate_id uuid not null references public.candidate_profiles(id) on delete cascade,
    company_name text not null,
    role_name text not null,
    overall_score numeric(5,2) check (overall_score is null or overall_score between 0 and 100),
    readiness_status text not null check (
        readiness_status in ('ready','almost_ready','needs_improvement','insufficient_data')
    ),
    category_scores jsonb not null default '{}'::jsonb,
    matched_skills jsonb not null default '[]'::jsonb,
    skill_gaps jsonb not null default '[]'::jsonb,
    recommendations jsonb not null default '[]'::jsonb,
    scoring_version text not null,
    created_at timestamptz not null default now()
);

-- 10. Candidate-to-specific-JD match history
create table if not exists public.skill_match_results (
    id uuid primary key default gen_random_uuid(),
    candidate_id uuid not null references public.candidate_profiles(id) on delete cascade,
    job_description_id uuid not null references public.job_descriptions(id) on delete cascade,
    overall_match_score numeric(5,2) check (overall_match_score is null or overall_match_score between 0 and 100),
    matched_skills jsonb not null default '[]'::jsonb,
    partial_matches jsonb not null default '[]'::jsonb,
    missing_skills jsonb not null default '[]'::jsonb,
    category_scores jsonb not null default '{}'::jsonb,
    recommendations jsonb not null default '[]'::jsonb,
    scoring_version text not null,
    created_at timestamptz not null default now()
);

-- Indexes for common lookups and joins
create index if not exists idx_candidate_skills_candidate_id
    on public.candidate_skills(candidate_id);
create index if not exists idx_candidate_education_candidate_id
    on public.candidate_education(candidate_id);
create index if not exists idx_candidate_projects_candidate_id
    on public.candidate_projects(candidate_id);
create index if not exists idx_candidate_experiences_candidate_id
    on public.candidate_experiences(candidate_id);
create index if not exists idx_candidate_certifications_candidate_id
    on public.candidate_certifications(candidate_id);
create index if not exists idx_job_descriptions_created_by
    on public.job_descriptions(created_by);
create index if not exists idx_job_descriptions_company_role
    on public.job_descriptions(company_name, job_title);
create index if not exists idx_job_required_skills_jd_id
    on public.job_required_skills(job_description_id);
create index if not exists idx_company_expectations_company_role
    on public.company_skill_expectations(company_name, role_name);
create index if not exists idx_talent_check_candidate_created
    on public.talent_check_results(candidate_id, created_at desc);
create index if not exists idx_skill_match_candidate_created
    on public.skill_match_results(candidate_id, created_at desc);
create index if not exists idx_skill_match_jd_id
    on public.skill_match_results(job_description_id);

-- Enable RLS on all 10 tables
alter table public.candidate_profiles enable row level security;
alter table public.candidate_skills enable row level security;
alter table public.candidate_education enable row level security;
alter table public.candidate_projects enable row level security;
alter table public.candidate_experiences enable row level security;
alter table public.candidate_certifications enable row level security;
alter table public.job_descriptions enable row level security;
alter table public.job_required_skills enable row level security;
alter table public.company_skill_expectations enable row level security;
alter table public.talent_check_results enable row level security;
alter table public.skill_match_results enable row level security;

-- Candidate profile: users can manage only their own profile.
drop policy if exists "Candidates can view own profile" on public.candidate_profiles;
create policy "Candidates can view own profile"
on public.candidate_profiles for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Candidates can insert own profile" on public.candidate_profiles;
create policy "Candidates can insert own profile"
on public.candidate_profiles for insert to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "Candidates can update own profile" on public.candidate_profiles;
create policy "Candidates can update own profile"
on public.candidate_profiles for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "Candidates can delete own profile" on public.candidate_profiles;
create policy "Candidates can delete own profile"
on public.candidate_profiles for delete to authenticated
using (user_id = (select auth.uid()));

-- Child records: access is granted only when the parent profile belongs to the user.
do $$
declare
    t text;
begin
    foreach t in array array[
        'candidate_skills',
        'candidate_education',
        'candidate_projects',
        'candidate_experiences',
        'candidate_certifications'
    ]
    loop
        execute format('drop policy if exists %I on public.%I', 'Users manage own ' || t, t);
        execute format(
            'create policy %I on public.%I for all to authenticated using (exists (select 1 from public.candidate_profiles p where p.id = candidate_id and p.user_id = (select auth.uid()))) with check (exists (select 1 from public.candidate_profiles p where p.id = candidate_id and p.user_id = (select auth.uid())))',
            'Users manage own ' || t, t
        );
    end loop;
end $$;

-- Job descriptions: creators can manage their own JDs.
drop policy if exists "Creators manage own job descriptions" on public.job_descriptions;
create policy "Creators manage own job descriptions"
on public.job_descriptions for all to authenticated
using (created_by = (select auth.uid()))
with check (created_by = (select auth.uid()));

-- Job skills: access only through a JD created by the current user.
drop policy if exists "Creators manage skills for own job descriptions" on public.job_required_skills;
create policy "Creators manage skills for own job descriptions"
on public.job_required_skills for all to authenticated
using (exists (
    select 1 from public.job_descriptions j
    where j.id = job_description_id and j.created_by = (select auth.uid())
))
with check (exists (
    select 1 from public.job_descriptions j
    where j.id = job_description_id and j.created_by = (select auth.uid())
));

-- Company expectations: authenticated users may read reference data.
drop policy if exists "Authenticated users read company expectations" on public.company_skill_expectations;
create policy "Authenticated users read company expectations"
on public.company_skill_expectations for select to authenticated
using (true);

-- No client write policy is created for company expectations.
-- Populate/update these rows via trusted server-side code or SQL Editor.

-- Talent Check: candidate owners can view and create their own results.
drop policy if exists "Users view own talent checks" on public.talent_check_results;
create policy "Users view own talent checks"
on public.talent_check_results for select to authenticated
using (exists (
    select 1 from public.candidate_profiles p
    where p.id = candidate_id and p.user_id = (select auth.uid())
));

drop policy if exists "Users create own talent checks" on public.talent_check_results;
create policy "Users create own talent checks"
on public.talent_check_results for insert to authenticated
with check (exists (
    select 1 from public.candidate_profiles p
    where p.id = candidate_id and p.user_id = (select auth.uid())
));

-- Skill Match: candidate owners can view and create their own match results.
drop policy if exists "Users view own skill matches" on public.skill_match_results;
create policy "Users view own skill matches"
on public.skill_match_results for select to authenticated
using (exists (
    select 1 from public.candidate_profiles p
    where p.id = candidate_id and p.user_id = (select auth.uid())
));

drop policy if exists "Users create own skill matches" on public.skill_match_results;
create policy "Users create own skill matches"
on public.skill_match_results for insert to authenticated
with check (exists (
    select 1 from public.candidate_profiles p
    where p.id = candidate_id and p.user_id = (select auth.uid())
));

commit;

-- Notes:
-- 1) If your app permits multiple profiles per user, remove UNIQUE from candidate_profiles.user_id.
-- 2) If a JD is intended to be shared among users, design an explicit sharing policy.
-- 3) Create a private Supabase Storage bucket for resumes/JDs and add Storage policies separately.
-- 4) For production, validate all JSONB payloads and scoring inputs in the FastAPI backend.
-- 5) The SQL does not seed official company expectations; import the hackathon dataset separately.
