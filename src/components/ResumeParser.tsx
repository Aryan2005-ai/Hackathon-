import { useState } from "react";
import { analyzeResume, saveResume, type ResumeAnalysis, type SaveResumeOptions } from "@/lib/resume-parser";

const CATEGORIES = [
  "COD", "DSA", "OOD", "APTI", "COMM", "AI",
  "CLOUD", "SQL", "SWE", "SYSD", "NETW", "OS", "OTHER",
];

export default function ResumeParser() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ResumeAnalysis | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Additional fields for saving to resumes table
  const [userId, setUserId] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [professionalSummary, setProfessionalSummary] = useState("");
  const [totalExperienceYears, setTotalExperienceYears] = useState("");

  async function runAnalysis() {
    if (!file) {
      setMessage("Choose a PDF or DOCX resume first.");
      return;
    }
    setBusy(true);
    setMessage("");
    setResult(null);
    try {
      const data = await analyzeResume(file);
      setResult(data);
      setCandidateName(data.candidate.name ?? "");
      setEmail(data.candidate.email ?? "");
      setPhone(data.candidate.phone ?? "");
      setMessage("Resume extracted. Review the fields and evidence before saving.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Resume analysis failed.");
    } finally {
      setBusy(false);
    }
  }

  async function onSave() {
    if (!result || !userId.trim()) {
      setMessage("Please enter your User ID before saving.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const saveOptions: SaveResumeOptions = {
        userId: userId.trim(),
        fileName: file?.name ?? "unknown",
        filePath: "",
        fileType: file?.type ?? "",
        fileSize: file?.size ?? 0,
        linkedinUrl: linkedinUrl.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
        professionalSummary: professionalSummary.trim() || undefined,
        totalExperienceYears: totalExperienceYears ? parseFloat(totalExperienceYears) : undefined,
      };

      await saveResume(
        { ...result, candidate: { ...result.candidate, name: candidateName, email, phone } },
        saveOptions
      );
      setMessage("Resume profile saved successfully.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not save resume.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
          RADIX Talent Match
        </p>
        <h1 className="mt-2 text-3xl font-bold">Resume Parser</h1>
        <p className="mt-2 text-slate-600">
          Upload a PDF or DOCX resume to extract candidate details and evidence-backed RADIX skills.
        </p>
      </header>

      <section className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium">
          Resume file (PDF or DOCX, max 12 MB)
          <input
            className="mt-2 block w-full rounded-lg border p-3"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setResult(null);
              setMessage("");
            }}
          />
        </label>
        <button
          className="rounded-lg bg-violet-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
          onClick={runAnalysis}
          disabled={busy || !file}
        >
          {busy ? "Working..." : "Parse resume"}
        </button>
        {message && (
          <p role="status" className="text-sm text-slate-700">{message}</p>
        )}
      </section>

      {result && (
        <section className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold">Candidate details — review and edit</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="text-sm font-medium">
                Name
                <input
                  className="mt-1 w-full rounded border p-2"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
              </label>
              <label className="text-sm font-medium">
                Email
                <input
                  className="mt-1 w-full rounded border p-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="text-sm font-medium">
                Phone
                <input
                  className="mt-1 w-full rounded border p-2"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold">Additional profile info (for saving)</h2>
            <p className="mt-1 text-sm text-slate-600">
              Required: User ID. Optional: profile links and summary.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium">
                User ID (required) *
                <input
                  className="mt-1 w-full rounded border p-2"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Supabase auth user ID"
                />
              </label>
              <label className="text-sm font-medium">
                Total experience (years)
                <input
                  className="mt-1 w-full rounded border p-2"
                  type="number"
                  step="0.5"
                  min="0"
                  value={totalExperienceYears}
                  onChange={(e) => setTotalExperienceYears(e.target.value)}
                  placeholder="e.g., 3.5"
                />
              </label>
              <label className="text-sm font-medium">
                LinkedIn URL
                <input
                  className="mt-1 w-full rounded border p-2"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                />
              </label>
              <label className="text-sm font-medium">
                GitHub URL
                <input
                  className="mt-1 w-full rounded border p-2"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                />
              </label>
              <label className="text-sm font-medium md:col-span-2">
                Portfolio URL
                <input
                  className="mt-1 w-full rounded border p-2"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://your-portfolio.com"
                />
              </label>
              <label className="text-sm font-medium md:col-span-2">
                Professional Summary
                <textarea
                  className="mt-1 w-full rounded border p-2"
                  rows={3}
                  value={professionalSummary}
                  onChange={(e) => setProfessionalSummary(e.target.value)}
                  placeholder="Brief professional summary..."
                />
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold">Skills and evidence</h2>
            <p className="mt-1 text-sm text-slate-600">
              Edit extracted skills and categories. Evidence should be a quote from the resume, not
              an assumption.
            </p>
            <div className="mt-3 space-y-3">
              {result.skills.map((skill, index) => (
                <div
                  key={`${skill.name}-${index}`}
                  className="grid gap-3 rounded-xl border p-4 md:grid-cols-4"
                >
                  <label className="text-sm">
                    Skill
                    <input
                      className="mt-1 w-full rounded border p-2"
                      value={skill.name}
                      onChange={(e) =>
                        setResult(
                          (old) =>
                            old && {
                              ...old,
                              skills: old.skills.map((s, i) =>
                                i === index ? { ...s, name: e.target.value } : s,
                              ),
                            },
                        )
                      }
                    />
                  </label>
                  <label className="text-sm">
                    Category
                    <select
                      className="mt-1 w-full rounded border p-2"
                      value={skill.category}
                      onChange={(e) =>
                        setResult(
                          (old) =>
                            old && {
                              ...old,
                              skills: old.skills.map((s, i) =>
                                i === index ? { ...s, category: e.target.value } : s,
                              ),
                            },
                        )
                      }
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm">
                    Confidence
                    <select
                      className="mt-1 w-full rounded border p-2"
                      value={skill.validation_status}
                      onChange={(e) =>
                        setResult(
                          (old) =>
                            old && {
                              ...old,
                              skills: old.skills.map((s, i) =>
                                i === index ? { ...s, validation_status: e.target.value } : s,
                              ),
                            },
                        )
                      }
                    >
                      <option value="needs_review">Needs review</option>
                      <option value="supported">Supported by evidence</option>
                      <option value="unverified">Unverified</option>
                    </select>
                  </label>
                  <label className="text-sm md:col-span-4">
                    Evidence
                    <input
                      className="mt-1 w-full rounded border p-2"
                      value={skill.evidence}
                      onChange={(e) =>
                        setResult(
                          (old) =>
                            old && {
                              ...old,
                              skills: old.skills.map((s, i) =>
                                i === index ? { ...s, evidence: e.target.value } : s,
                              ),
                            },
                        )
                      }
                    />
                  </label>
                  <button
                    className="justify-self-start text-sm text-red-600 underline"
                    onClick={() =>
                      setResult(
                        (old) =>
                          old && { ...old, skills: old.skills.filter((_, i) => i !== index) },
                      )
                    }
                  >
                    Remove skill
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold">Education</h2>
            {result.education.length ? (
              <ul className="mt-2 list-disc pl-6">
                {result.education.map((e, i) => (
                  <li key={i}>
                    {[e.degree, e.institution, e.graduation_year].filter(Boolean).join(" — ")}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-600">
                No education entries were confidently extracted.
              </p>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">Projects</h2>
            {result.projects.length ? (
              <ul className="mt-2 list-disc pl-6">
                {result.projects.map((p, i) => (
                  <li key={i}>
                    <strong>{p.name}</strong>
                    {p.description ? ` — ${p.description}` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-600">No projects were confidently extracted.</p>
            )}
          </div>
          <button
            onClick={onSave}
            disabled={busy}
            className="rounded-lg bg-violet-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Saving..." : "Save candidate profile"}
          </button>
        </section>
      )}
    </main>
  );
}