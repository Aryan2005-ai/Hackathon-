export type ResumeSkill = {
  name: string;
  category: string;
  evidence: string;
  validation_status: "supported" | "needs_review" | "unverified" | string;
};

export type ResumeAnalysis = {
  candidate: { name?: string | null; email?: string | null; phone?: string | null };
  education: Array<{
    degree?: string | null;
    institution?: string | null;
    graduation_year?: string | number | null;
  }>;
  projects: Array<{ name: string; description?: string | null; technologies?: string[] }>;
  skills: ResumeSkill[];
  extraction_warnings: string[];
};

export type SaveResumeOptions = {
  userId: string;
  fileName: string;
  filePath?: string;
  fileType?: string;
  fileSize?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  professionalSummary?: string;
  totalExperienceYears?: number;
};

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

async function parseError(response: Response) {
  const body = await response.text();
  try {
    const json = JSON.parse(body);
    return json.detail || json.message || body;
  } catch {
    return body || `Request failed (${response.status})`;
  }
}

export async function analyzeResume(file: File): Promise<ResumeAnalysis> {
  if (!/\.(pdf|docx)$/i.test(file.name))
    throw new Error("Unsupported file. Upload a PDF or DOCX resume.");
  if (file.size > 12 * 1024 * 1024) throw new Error("File is larger than 12 MB.");
  const form = new FormData();
  form.append("file", file);
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/api/resume-parser/analyze`, { method: "POST", body: form });
  } catch {
    throw new Error(
      `Cannot reach the Resume Parser API at ${API_BASE}. Start the FastAPI backend and check its CORS settings.`,
    );
  }
  if (!response.ok) throw new Error(String(await parseError(response)));
  return response.json();
}

export async function saveResume(
  data: ResumeAnalysis,
  options: SaveResumeOptions
): Promise<{ ok: boolean; saved_id?: string }> {
  const form = new FormData();
  form.append("user_id", options.userId);
  form.append("file_name", options.fileName);
  if (options.filePath) form.append("file_path", options.filePath);
  if (options.fileType) form.append("file_type", options.fileType);
  if (options.fileSize) form.append("file_size", String(options.fileSize));
  if (options.linkedinUrl) form.append("linkedin_url", options.linkedinUrl);
  if (options.githubUrl) form.append("github_url", options.githubUrl);
  if (options.portfolioUrl) form.append("portfolio_url", options.portfolioUrl);
  if (options.professionalSummary) form.append("professional_summary", options.professionalSummary);
  if (options.totalExperienceYears) form.append("total_experience_years", String(options.totalExperienceYears));
  form.append("data", JSON.stringify(data));

  let response: Response;
  try {
    response = await fetch(`${API_BASE}/api/resume-parser/save`, {
      method: "POST",
      body: form,
    });
  } catch {
    throw new Error(`Cannot reach the Resume Parser API at ${API_BASE}.`);
  }
  if (!response.ok) throw new Error(String(await parseError(response)));
  return response.json();
}