GRANT SELECT ON public.company_json TO anon;
GRANT SELECT (company_id, incorporation_year, headquarters_address, website_url) ON public.companies TO anon;
GRANT SELECT ON public.company_skill_levels, public.skill_set_master, public.skill_set_topics, public.proficiency_levels TO anon;
CREATE POLICY "Public placement company research" ON public.company_json FOR SELECT TO anon USING (true);
CREATE POLICY "Public placement company identity" ON public.companies FOR SELECT TO anon USING (true);
CREATE POLICY "Public placement skill requirements" ON public.company_skill_levels FOR SELECT TO anon USING (true);
CREATE POLICY "Public placement skill names" ON public.skill_set_master FOR SELECT TO anon USING (true);
CREATE POLICY "Public placement learning topics" ON public.skill_set_topics FOR SELECT TO anon USING (true);
CREATE POLICY "Public placement proficiency names" ON public.proficiency_levels FOR SELECT TO anon USING (true);