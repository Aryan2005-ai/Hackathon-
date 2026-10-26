-- RADIX Talent Match: additional validation checks and triggers
-- Run AFTER the 10 base tables have been created.
-- Safe to rerun: triggers are replaced, and constraints are added only if absent.

begin;

-- 1. Automatically maintain updated_at columns.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at := now();
    return new;
end;
$$;

drop trigger if exists trg_candidate_profiles_updated_at on public.candidate_profiles;
create trigger trg_candidate_profiles_updated_at
before update on public.candidate_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_job_descriptions_updated_at on public.job_descriptions;
create trigger trg_job_descriptions_updated_at
before update on public.job_descriptions
for each row execute function public.set_updated_at();


-- 2. Normalize skill names consistently.
-- This trims whitespace, collapses repeated spaces, and lowercases the name.
-- It does NOT perform semantic alias mapping (e.g. JS -> JavaScript); do that in the backend.
create or replace function public.normalize_talent_skill_name()
returns trigger
language plpgsql
as $$
begin
    if new.skill_name is null or length(trim(new.skill_name)) = 0 then
        raise exception 'skill_name cannot be blank';
    end if;

    new.skill_name := regexp_replace(trim(new.skill_name), '\s+', ' ', 'g');
    new.normalized_skill_name := lower(new.skill_name);
    return new;
end;
$$;

drop trigger if exists trg_normalize_candidate_skill on public.candidate_skills;
create trigger trg_normalize_candidate_skill
before insert or update of skill_name, normalized_skill_name
on public.candidate_skills
for each row execute function public.normalize_talent_skill_name();

drop trigger if exists trg_normalize_job_required_skill on public.job_required_skills;
create trigger trg_normalize_job_required_skill
before insert or update of skill_name, normalized_skill_name
on public.job_required_skills
for each row execute function public.normalize_talent_skill_name();

drop trigger if exists trg_normalize_company_expectation_skill on public.company_skill_expectations;
create trigger trg_normalize_company_expectation_skill
before insert or update of skill_name, normalized_skill_name
on public.company_skill_expectations
for each row execute function public.normalize_talent_skill_name();


-- 3. Add additional CHECK constraints only when they are not already present.
do $$
begin
    -- Candidate profile JSON and nonblank name
    if not exists (select 1 from pg_constraint where conname = 'candidate_profiles_full_name_nonblank') then
        alter table public.candidate_profiles
            add constraint candidate_profiles_full_name_nonblank
            check (length(trim(full_name)) > 0);
    end if;

    if not exists (select 1 from pg_constraint where conname = 'candidate_profiles_education_is_array') then
        alter table public.candidate_profiles
            add constraint candidate_profiles_education_is_array
            check (jsonb_typeof(education) = 'array');
    end if;

    -- Candidate skills
    if not exists (select 1 from pg_constraint where conname = 'candidate_skills_skill_name_nonblank') then
        alter table public.candidate_skills
            add constraint candidate_skills_skill_name_nonblank
            check (length(trim(skill_name)) > 0);
    end if;

    if not exists (select 1 from pg_constraint where conname = 'candidate_skills_evidence_is_array') then
        alter table public.candidate_skills
            add constraint candidate_skills_evidence_is_array
            check (jsonb_typeof(evidence) = 'array');
    end if;

    -- Projects
    if not exists (select 1 from pg_constraint where conname = 'candidate_projects_name_nonblank') then
        alter table public.candidate_projects
            add constraint candidate_projects_name_nonblank
            check (length(trim(project_name)) > 0);
    end if;

    if not exists (select 1 from pg_constraint where conname = 'candidate_projects_technologies_is_array') then
        alter table public.candidate_projects
            add constraint candidate_projects_technologies_is_array
            check (jsonb_typeof(technologies) = 'array');
    end if;

    -- Experiences
    if not exists (select 1 from pg_constraint where conname = 'candidate_experiences_company_nonblank') then
        alter table public.candidate_experiences
            add constraint candidate_experiences_company_nonblank
            check (length(trim(company_name)) > 0);
    end if;

    if not exists (select 1 from pg_constraint where conname = 'candidate_experiences_title_nonblank') then
        alter table public.candidate_experiences
            add constraint candidate_experiences_title_nonblank
            check (length(trim(job_title)) > 0);
    end if;

    if not exists (select 1 from pg_constraint where conname = 'candidate_experiences_technologies_is_array') then
        alter table public.candidate_experiences
            add constraint candidate_experiences_technologies_is_array
            check (jsonb_typeof(technologies) = 'array');
    end if;

    -- Certifications
    if not exists (select 1 from pg_constraint where conname = 'candidate_certifications_title_nonblank') then
        alter table public.candidate_certifications
            add constraint candidate_certifications_title_nonblank
            check (length(trim(title)) > 0);
    end if;

    -- Job descriptions
    if not exists (select 1 from pg_constraint where conname = 'job_descriptions_company_nonblank') then
        alter table public.job_descriptions
            add constraint job_descriptions_company_nonblank
            check (length(trim(company_name)) > 0);
    end if;

    if not exists (select 1 from pg_constraint where conname = 'job_descriptions_title_nonblank') then
        alter table public.job_descriptions
            add constraint job_descriptions_title_nonblank
            check (length(trim(job_title)) > 0);
    end if;

    if not exists (select 1 from pg_constraint where conname = 'job_descriptions_text_nonblank') then
        alter table public.job_descriptions
            add constraint job_descriptions_text_nonblank
            check (length(trim(description_text)) > 0);
    end if;

    if not exists (select 1 from pg_constraint where conname = 'job_descriptions_analysis_error_status') then
        alter table public.job_descriptions
            add constraint job_descriptions_analysis_error_status
            check (analysis_error is null or analysis_status = 'failed');
    end if;

    -- Job required skills
    if not exists (select 1 from pg_constraint where conname = 'job_required_skills_evidence_nonblank') then
        alter table public.job_required_skills
            add constraint job_required_skills_evidence_nonblank
            check (length(trim(evidence_text)) > 0);
    end if;

    -- Company expectations
    if not exists (select 1 from pg_constraint where conname = 'company_expectations_names_nonblank') then
        alter table public.company_skill_expectations
            add constraint company_expectations_names_nonblank
            check (
                length(trim(company_name)) > 0
                and length(trim(role_name)) > 0
                and length(trim(source)) > 0
            );
    end if;

    -- Assessment JSON payload types
    if not exists (select 1 from pg_constraint where conname = 'talent_check_category_scores_is_object') then
        alter table public.talent_check_results
            add constraint talent_check_category_scores_is_object
            check (jsonb_typeof(category_scores) = 'object');
    end if;

    if not exists (select 1 from pg_constraint where conname = 'talent_check_skill_payloads_are_arrays') then
        alter table public.talent_check_results
            add constraint talent_check_skill_payloads_are_arrays
            check (
                jsonb_typeof(matched_skills) = 'array'
                and jsonb_typeof(skill_gaps) = 'array'
                and jsonb_typeof(recommendations) = 'array'
            );
    end if;

    if not exists (select 1 from pg_constraint where conname = 'skill_match_category_scores_is_object') then
        alter table public.skill_match_results
            add constraint skill_match_category_scores_is_object
            check (jsonb_typeof(category_scores) = 'object');
    end if;

    if not exists (select 1 from pg_constraint where conname = 'skill_match_skill_payloads_are_arrays') then
        alter table public.skill_match_results
            add constraint skill_match_skill_payloads_are_arrays
            check (
                jsonb_typeof(matched_skills) = 'array'
                and jsonb_typeof(partial_matches) = 'array'
                and jsonb_typeof(missing_skills) = 'array'
                and jsonb_typeof(recommendations) = 'array'
            );
    end if;
end $$;

commit;

-- Suggested manual verification:
-- 1) Update a candidate profile and confirm updated_at changes.
-- 2) Insert skill_name='  Python  ' and confirm normalized_skill_name='python'.
-- 3) Try confidence=1.5; it should fail due to the base table CHECK.
-- 4) Try an unsupported skill_category; it should fail due to the base table CHECK.
-- 5) Try inserting a child row with an unknown candidate_id; the foreign key should reject it.
