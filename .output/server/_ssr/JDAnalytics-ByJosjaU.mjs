import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/JDAnalytics-ByJosjaU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var API = "http://127.0.0.1:8000";
var categories = [
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
	"OTHER"
];
var categoryLabels = {
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
	OTHER: "Other / Domain-specific"
};
async function messageFrom(response) {
	try {
		const data = await response.json();
		return data?.detail?.message || data?.message || JSON.stringify(data);
	} catch {
		return `Request failed (${response.status})`;
	}
}
function JDAnalytics() {
	const [file, setFile] = (0, import_react.useState)(null);
	const [text, setText] = (0, import_react.useState)("");
	const [company, setCompany] = (0, import_react.useState)("");
	const [title, setTitle] = (0, import_react.useState)("");
	const [analysis, setAnalysis] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	const [showSource, setShowSource] = (0, import_react.useState)(false);
	const sourceText = analysis?.description_text || "";
	const verifiedCount = (0, import_react.useMemo)(() => analysis?.skills.filter((s) => s.evidence_text.trim() && sourceText.toLowerCase().includes(s.evidence_text.trim().toLowerCase())).length ?? 0, [analysis, sourceText]);
	function updateSkill(index, patch) {
		setAnalysis((current) => current ? {
			...current,
			skills: current.skills.map((s, i) => i === index ? {
				...s,
				...patch
			} : s)
		} : current);
	}
	async function runAnalysis(e) {
		e.preventDefault();
		setError("");
		setNotice("");
		setAnalysis(null);
		if (!file && text.trim().length < 40) {
			setError("Paste a complete job description (at least 40 characters) or upload a PDF/DOCX file.");
			return;
		}
		const body = new FormData();
		if (file) body.append("file", file);
		else body.append("text", text);
		body.append("company_name", company);
		body.append("job_title", title);
		setBusy(true);
		try {
			const response = await fetch(`${API}/api/jd-analytics/analyze`, {
				method: "POST",
				body
			});
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
				body: JSON.stringify({
					...analysis,
					company_name: company,
					job_title: title
				})
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl space-y-6 p-4 md:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold uppercase tracking-wider text-indigo-600",
					children: "RADIX Talent Match"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-3xl font-bold",
					children: "JD Analytics"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-slate-600",
					children: "Upload a job description or paste its text to extract categorized skills with evidence you can verify and edit."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: runAnalysis,
				className: "space-y-4 rounded-2xl border bg-white p-5 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm font-medium",
							children: ["Company name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: company,
								onChange: (e) => setCompany(e.target.value),
								className: "mt-1 w-full rounded-lg border p-2.5",
								placeholder: "e.g. Google LLC"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm font-medium",
							children: ["Job title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: title,
								onChange: (e) => setTitle(e.target.value),
								className: "mt-1 w-full rounded-lg border p-2.5",
								placeholder: "e.g. Software Engineer"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-medium",
						children: ["Upload PDF or DOCX ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
							onChange: (e) => {
								setFile(e.target.files?.[0] || null);
								if (e.target.files?.[0]) setText("");
							},
							className: "mt-2 block w-full rounded-lg border p-3"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center text-sm text-slate-500",
						children: "— or paste text below —"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-medium",
						children: ["Job description text", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: text,
							onChange: (e) => {
								setText(e.target.value);
								if (e.target.value) setFile(null);
							},
							rows: 8,
							className: "mt-1 w-full rounded-lg border p-3 font-normal",
							placeholder: "Paste the full job description here…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500",
							children: "PDF/DOCX max 12 MB. Scanned PDFs may require OCR or pasted text."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: busy,
							className: "rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white disabled:opacity-60",
							children: busy ? "Analyzing…" : "Analyze job description"
						})]
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "alert",
				className: "rounded-lg border border-red-200 bg-red-50 p-4 text-red-800",
				children: error
			}),
			notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "status",
				className: "rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800",
				children: notice
			}),
			analysis && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-bold",
							children: "Extracted skills"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-slate-600",
							children: [
								analysis.skills.length,
								" skills · ",
								verifiedCount,
								" evidence quotes verified · ",
								analysis.skills.length - verifiedCount,
								" need review"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: save,
							disabled: saving,
							className: "rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white disabled:opacity-60",
							children: saving ? "Saving…" : "Save analysis"
						})]
					}),
					analysis.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-xl bg-slate-50 p-4 text-slate-700",
						children: analysis.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: categories.filter((c) => analysis.skills.some((s) => s.skill_category === c)).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full border bg-white px-3 py-1 text-xs",
							children: [
								c,
								" · ",
								categoryLabels[c],
								" (",
								analysis.skills.filter((s) => s.skill_category === c).length,
								")"
							]
						}, c))
					}),
					analysis.skills.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-lg border border-amber-200 bg-amber-50 p-4",
						children: "No skills were returned. Check the source text and retry; no placeholder results were added."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: analysis.skills.map((skill, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "space-y-3 rounded-xl border bg-white p-4 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 md:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs font-semibold uppercase text-slate-500",
											children: ["Skill name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: skill.skill_name,
												onChange: (e) => updateSkill(i, {
													skill_name: e.target.value,
													normalized_skill_name: e.target.value.toLowerCase().trim().replace(/[^a-z0-9+#.]+/g, " ")
												}),
												className: "mt-1 w-full rounded-md border p-2 text-sm font-normal normal-case text-slate-900"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs font-semibold uppercase text-slate-500",
											children: ["RADIX category", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												value: skill.skill_category,
												onChange: (e) => updateSkill(i, {
													skill_category: e.target.value,
													category_label: categoryLabels[e.target.value]
												}),
												className: "mt-1 w-full rounded-md border p-2 text-sm font-normal normal-case text-slate-900",
												children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
													value: c,
													children: [
														c,
														" — ",
														categoryLabels[c]
													]
												}, c))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs font-semibold uppercase text-slate-500",
											children: ["Requirement type", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: skill.requirement_type,
												onChange: (e) => updateSkill(i, { requirement_type: e.target.value }),
												className: "mt-1 w-full rounded-md border p-2 text-sm font-normal normal-case text-slate-900",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "required",
														children: "Required"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "preferred",
														children: "Preferred"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "soft_skill",
														children: "Soft skill"
													})
												]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 md:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs font-semibold uppercase text-slate-500",
										children: ["Required level", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: skill.required_level || "",
											onChange: (e) => updateSkill(i, { required_level: e.target.value || null }),
											className: "mt-1 w-full rounded-md border p-2 text-sm font-normal normal-case text-slate-900",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "Not specified"
											}), [
												"beginner",
												"intermediate",
												"advanced",
												"expert"
											].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: v }, v))]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs font-semibold uppercase text-slate-500",
										children: [
											"Importance (",
											Math.round(skill.importance_weight * 100),
											"%)",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "range",
												min: "0",
												max: "1",
												step: "0.05",
												value: skill.importance_weight,
												onChange: (e) => updateSkill(i, { importance_weight: Number(e.target.value) }),
												className: "mt-3 block w-full"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs font-semibold uppercase text-slate-500",
									children: ["Evidence quote (edit to match source exactly)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: skill.evidence_text,
										onChange: (e) => updateSkill(i, { evidence_text: e.target.value }),
										rows: 2,
										className: "mt-1 w-full rounded-md border p-2 text-sm font-normal normal-case text-slate-900"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: skill.evidence_text.trim() && sourceText.toLowerCase().includes(skill.evidence_text.trim().toLowerCase()) ? "font-semibold text-emerald-700" : "font-semibold text-amber-700",
											children: skill.evidence_text.trim() && sourceText.toLowerCase().includes(skill.evidence_text.trim().toLowerCase()) ? "✓ Evidence verified against source" : "⚠ Evidence not verified — review before saving"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-slate-500",
											children: [
												"Model confidence: ",
												Math.round(skill.confidence * 100),
												"% · Edit confidence is not a guarantee of correctness"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setAnalysis((a) => a ? {
												...a,
												skills: a.skills.filter((_, idx) => idx !== i)
											} : a),
											className: "text-red-600 underline",
											children: "Remove skill"
										})
									]
								})
							]
						}, `${skill.normalized_skill_name}-${i}`))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowSource((v) => !v),
							className: "text-sm font-semibold underline",
							children: showSource ? "Hide source text" : "Review extracted source text"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: save,
							disabled: saving,
							className: "rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white disabled:opacity-60",
							children: saving ? "Saving…" : "Save edited results"
						})]
					}),
					showSource && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm",
						children: sourceText
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500",
						children: "LLM output is a draft, not a verified hiring standard. Review all skills and evidence. Save requires configured Supabase credentials; no results are silently fabricated if the LLM is unavailable."
					})
				]
			})
		]
	});
}
function JDAnalyticsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDAnalytics, {});
}
//#endregion
export { JDAnalyticsPage as component };
