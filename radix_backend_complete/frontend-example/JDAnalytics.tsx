import { useMemo, useState } from "react";

type Skill = {
  skill_name: string;
  normalized_skill_name: string;
  skill_category: string;
  category_label?: string;
  requirement_type: "required" | "preferred" | "soft_skill";
  required_level: "beginner" | "intermediate" | "advanced" | "expert" | null;
  importance_weight: number;
  evidence_text: string;
  evidence_valid: boolean;
  confidence: number;
  validation_warnings: string[];
};
type Analysis = {
  company_name: string;
  job_title: string;
  summary: string;
  description_text: string;
  skills: Skill[];
  source_type: "pdf" | "docx" | "pasted_text";
  validation: {
    skill_count: number;
    evidence_verified: number;
    evidence_unverified: number;
    categories_used: string[];
    requires_review: boolean;
  };
};
const API = (import.meta as any).env?.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const categories = [
  "COD",
  "DSA",
  "OOD",
  "APTI",
  "COMM",
  "AI",
  "CLOUD",
  "SQL",
  "SWE",
  "SYSD",
  "NETW",
  "OS",
  "OTHER",
];
const categoryLabels: Record<string, string> = {
  COD: "Coding / Programming",
  DSA: "Data Structures & Algorithms",
  OOD: "Object-Oriented Design",
  APTI: "Aptitude / Problem Solving",
  COMM: "Communication",
  AI: "AI / Machine Learning",
  CLOUD: "Cloud / DevOps",
  SQL: "Databases / SQL",
  SWE: "Software Engineering",
  SYSD: "System Design",
  NETW: "Computer Networks",
  OS: "Operating Systems",
  OTHER: "Other / Domain-specific",
};

async function messageFrom(response: Response) {
  try {
    const data = await response.json();
    return data?.detail?.message || data?.message || JSON.stringify(data);
  } catch {
    return `Request failed (${response.status})`;
  }
}

export default function JDAnalytics() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showSource, setShowSource] = useState(false);
  const sourceText = analysis?.description_text || "";
  const verifiedCount = useMemo(
    () =>
      analysis?.skills.filter(
        (s) =>
          s.evidence_text.trim() &&
          sourceText.toLowerCase().includes(s.evidence_text.trim().toLowerCase()),
      ).length ?? 0,
    [analysis, sourceText],
  );

  function updateSkill(index: number, patch: Partial<Skill>) {
    setAnalysis((current) =>
      current
        ? {
            ...current,
            skills: current.skills.map((s, i) => (i === index ? { ...s, ...patch } : s)),
          }
        : current,
    );
  }
  async function runAnalysis(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setAnalysis(null);
    if (!file && text.trim().length < 40) {
      setError(
        "Paste a complete job description (at least 40 characters) or upload a PDF/DOCX file.",
      );
      return;
    }
    const body = new FormData();
    if (file) body.append("file", file);
    else body.append("text", text);
    body.append("company_name", company);
    body.append("job_title", title);
    setBusy(true);
    try {
      const response = await fetch(`${API}/api/jd-analytics/analyze`, { method: "POST", body });
      if (!response.ok) throw new Error(await messageFrom(response));
      const result = await response.json();
      setAnalysis(result);
      setNotice("Analysis complete. Review the evidence and edit any skills before saving.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not analyze this job description.");
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    if (!analysis) return;
    setError("");
    setNotice("");
    setSaving(true);
    try {
      const response = await fetch(`${API}/api/jd-analytics/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...analysis, company_name: company, job_title: title }),
      });
      if (!response.ok) throw new Error(await messageFrom(response));
      const result = await response.json();
      setNotice(`${result.message} Saved ${result.saved_skill_count} skills.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save analysis.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          RADIX Talent Match
        </p>
        <h1 className="mt-1 text-3xl font-bold">JD Analytics</h1>
        <p className="mt-2 text-slate-600">
          Upload a job description or paste its text to extract categorized skills with evidence you
          can verify and edit.
        </p>
      </header>
      <form onSubmit={runAnalysis} className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium">
            Company name
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2.5"
              placeholder="e.g. Google LLC"
            />
          </label>
          <label className="block text-sm font-medium">
            Job title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2.5"
              placeholder="e.g. Software Engineer"
            />
          </label>
        </div>
        <label className="block text-sm font-medium">
          Upload PDF or DOCX{" "}
          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              if (e.target.files?.[0]) setText("");
            }}
            className="mt-2 block w-full rounded-lg border p-3"
          />
        </label>
        <div className="text-center text-sm text-slate-500">— or paste text below —</div>
        <label className="block text-sm font-medium">
          Job description text
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (e.target.value) setFile(null);
            }}
            rows={8}
            className="mt-1 w-full rounded-lg border p-3 font-normal"
            placeholder="Paste the full job description here…"
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            PDF/DOCX max 12 MB. Scanned PDFs may require OCR or pasted text.
          </p>
          <button
            disabled={busy}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Analyzing…" : "Analyze job description"}
          </button>
        </div>
      </form>
      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}
      {notice && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"
        >
          {notice}
        </div>
      )}
      {analysis && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Extracted skills</h2>
              <p className="text-sm text-slate-600">
                {analysis.skills.length} skills · {verifiedCount} evidence quotes verified ·{" "}
                {analysis.skills.length - verifiedCount} need review
              </p>
            </div>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save analysis"}
            </button>
          </div>
          {analysis.summary && (
            <p className="rounded-xl bg-slate-50 p-4 text-slate-700">{analysis.summary}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((c) => analysis.skills.some((s) => s.skill_category === c))
              .map((c) => (
                <span key={c} className="rounded-full border bg-white px-3 py-1 text-xs">
                  {c} · {categoryLabels[c]} (
                  {analysis.skills.filter((s) => s.skill_category === c).length})
                </span>
              ))}
          </div>
          {analysis.skills.length === 0 && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              No skills were returned. Check the source text and retry; no placeholder results were
              added.
            </p>
          )}
          <div className="space-y-4">
            {analysis.skills.map((skill, i) => (
              <article
                key={`${skill.normalized_skill_name}-${i}`}
                className="space-y-3 rounded-xl border bg-white p-4 shadow-sm"
              >
                <div className="grid gap-3 md:grid-cols-3">
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    Skill name
                    <input
                      value={skill.skill_name}
                      onChange={(e) =>
                        updateSkill(i, {
                          skill_name: e.target.value,
                          normalized_skill_name: e.target.value
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9+#.]+/g, " "),
                        })
                      }
                      className="mt-1 w-full rounded-md border p-2 text-sm font-normal normal-case text-slate-900"
                    />
                  </label>
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    RADIX category
                    <select
                      value={skill.skill_category}
                      onChange={(e) =>
                        updateSkill(i, {
                          skill_category: e.target.value,
                          category_label: categoryLabels[e.target.value],
                        })
                      }
                      className="mt-1 w-full rounded-md border p-2 text-sm font-normal normal-case text-slate-900"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c} — {categoryLabels[c]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    Requirement type
                    <select
                      value={skill.requirement_type}
                      onChange={(e) =>
                        updateSkill(i, {
                          requirement_type: e.target.value as Skill["requirement_type"],
                        })
                      }
                      className="mt-1 w-full rounded-md border p-2 text-sm font-normal normal-case text-slate-900"
                    >
                      <option value="required">Required</option>
                      <option value="preferred">Preferred</option>
                      <option value="soft_skill">Soft skill</option>
                    </select>
                  </label>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    Required level
                    <select
                      value={skill.required_level || ""}
                      onChange={(e) =>
                        updateSkill(i, {
                          required_level: (e.target.value || null) as Skill["required_level"],
                        })
                      }
                      className="mt-1 w-full rounded-md border p-2 text-sm font-normal normal-case text-slate-900"
                    >
                      <option value="">Not specified</option>
                      {["beginner", "intermediate", "advanced", "expert"].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    Importance ({Math.round(skill.importance_weight * 100)}%)
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={skill.importance_weight}
                      onChange={(e) =>
                        updateSkill(i, { importance_weight: Number(e.target.value) })
                      }
                      className="mt-3 block w-full"
                    />
                  </label>
                </div>
                <label className="block text-xs font-semibold uppercase text-slate-500">
                  Evidence quote (edit to match source exactly)
                  <textarea
                    value={skill.evidence_text}
                    onChange={(e) => updateSkill(i, { evidence_text: e.target.value })}
                    rows={2}
                    className="mt-1 w-full rounded-md border p-2 text-sm font-normal normal-case text-slate-900"
                  />
                </label>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span
                    className={
                      skill.evidence_text.trim() &&
                      sourceText.toLowerCase().includes(skill.evidence_text.trim().toLowerCase())
                        ? "font-semibold text-emerald-700"
                        : "font-semibold text-amber-700"
                    }
                  >
                    {skill.evidence_text.trim() &&
                    sourceText.toLowerCase().includes(skill.evidence_text.trim().toLowerCase())
                      ? "✓ Evidence verified against source"
                      : "⚠ Evidence not verified — review before saving"}
                  </span>
                  <span className="text-slate-500">
                    Model confidence: {Math.round(skill.confidence * 100)}% · Edit confidence is not
                    a guarantee of correctness
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setAnalysis((a) =>
                        a ? { ...a, skills: a.skills.filter((_, idx) => idx !== i) } : a,
                      )
                    }
                    className="text-red-600 underline"
                  >
                    Remove skill
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
            <button
              type="button"
              onClick={() => setShowSource((v) => !v)}
              className="text-sm font-semibold underline"
            >
              {showSource ? "Hide source text" : "Review extracted source text"}
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save edited results"}
            </button>
          </div>
          {showSource && (
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm">
              {sourceText}
            </pre>
          )}
          <p className="text-xs text-slate-500">
            LLM output is a draft, not a verified hiring standard. Review all skills and evidence.
            Save requires configured Supabase credentials; no results are silently fabricated if the
            LLM is unavailable.
          </p>
        </section>
      )}
    </main>
  );
}
