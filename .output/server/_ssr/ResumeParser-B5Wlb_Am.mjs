import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ResumeParser-B5Wlb_Am.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var API_BASE = "http://127.0.0.1:8000".replace(/\/$/, "") || "http://127.0.0.1:8000";
async function parseError(response) {
	const body = await response.text();
	try {
		const json = JSON.parse(body);
		return json.detail || json.message || body;
	} catch {
		return body || `Request failed (${response.status})`;
	}
}
async function analyzeResume(file) {
	if (!/\.(pdf|docx)$/i.test(file.name)) throw new Error("Unsupported file. Upload a PDF or DOCX resume.");
	if (file.size > 12582912) throw new Error("File is larger than 12 MB.");
	const form = new FormData();
	form.append("file", file);
	let response;
	try {
		response = await fetch(`${API_BASE}/api/resume-parser/analyze`, {
			method: "POST",
			body: form
		});
	} catch {
		throw new Error(`Cannot reach the Resume Parser API at ${API_BASE}. Start the FastAPI backend and check its CORS settings.`);
	}
	if (!response.ok) throw new Error(String(await parseError(response)));
	return response.json();
}
async function saveResume(data) {
	let response;
	try {
		response = await fetch(`${API_BASE}/api/resume-parser/save`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});
	} catch {
		throw new Error(`Cannot reach the Resume Parser API at ${API_BASE}.`);
	}
	if (!response.ok) throw new Error(String(await parseError(response)));
	return response.json();
}
var CATEGORIES = [
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
function ResumeParser() {
	const [file, setFile] = (0, import_react.useState)(null);
	const [result, setResult] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)("");
	const [candidateName, setCandidateName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
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
		if (!result) return;
		setBusy(true);
		setMessage("");
		try {
			await saveResume({
				...result,
				candidate: {
					...result.candidate,
					name: candidateName,
					email,
					phone
				}
			});
			setMessage("Resume profile saved successfully.");
		} catch (e) {
			setMessage(e instanceof Error ? e.message : "Could not save resume.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-5xl space-y-6 p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold uppercase tracking-widest text-violet-600",
					children: "RADIX Talent Match"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-3xl font-bold",
					children: "Resume Parser"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-slate-600",
					children: "Upload a PDF or DOCX resume to extract candidate details and evidence-backed RADIX skills."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 rounded-2xl border bg-white p-6 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-medium",
						children: ["Resume file (PDF or DOCX, max 12 MB)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "mt-2 block w-full rounded-lg border p-3",
							type: "file",
							accept: ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
							onChange: (e) => {
								setFile(e.target.files?.[0] ?? null);
								setResult(null);
								setMessage("");
							}
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "rounded-lg bg-violet-600 px-5 py-3 font-semibold text-white disabled:opacity-50",
						onClick: runAnalysis,
						disabled: busy || !file,
						children: busy ? "Working..." : "Parse resume"
					}),
					message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "text-sm text-slate-700",
						children: message
					})
				]
			}),
			result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-6 rounded-2xl border bg-white p-6 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold",
						children: "Candidate details — review and edit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium",
								children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "mt-1 w-full rounded border p-2",
									value: candidateName,
									onChange: (e) => setCandidateName(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium",
								children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "mt-1 w-full rounded border p-2",
									value: email,
									onChange: (e) => setEmail(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium",
								children: ["Phone", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "mt-1 w-full rounded border p-2",
									value: phone,
									onChange: (e) => setPhone(e.target.value)
								})]
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-bold",
							children: "Skills and evidence"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-slate-600",
							children: "Edit extracted skills and categories. Evidence should be a quote from the resume, not an assumption."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 space-y-3",
							children: result.skills.map((skill, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 rounded-xl border p-4 md:grid-cols-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-sm",
										children: ["Skill", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "mt-1 w-full rounded border p-2",
											value: skill.name,
											onChange: (e) => setResult((old) => old && {
												...old,
												skills: old.skills.map((s, i) => i === index ? {
													...s,
													name: e.target.value
												} : s)
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-sm",
										children: ["Category", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											className: "mt-1 w-full rounded border p-2",
											value: skill.category,
											onChange: (e) => setResult((old) => old && {
												...old,
												skills: old.skills.map((s, i) => i === index ? {
													...s,
													category: e.target.value
												} : s)
											}),
											children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-sm",
										children: ["Confidence", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "mt-1 w-full rounded border p-2",
											value: skill.validation_status,
											onChange: (e) => setResult((old) => old && {
												...old,
												skills: old.skills.map((s, i) => i === index ? {
													...s,
													validation_status: e.target.value
												} : s)
											}),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "needs_review",
													children: "Needs review"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "supported",
													children: "Supported by evidence"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "unverified",
													children: "Unverified"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-sm md:col-span-4",
										children: ["Evidence", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "mt-1 w-full rounded border p-2",
											value: skill.evidence,
											onChange: (e) => setResult((old) => old && {
												...old,
												skills: old.skills.map((s, i) => i === index ? {
													...s,
													evidence: e.target.value
												} : s)
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "justify-self-start text-sm text-red-600 underline",
										onClick: () => setResult((old) => old && {
											...old,
											skills: old.skills.filter((_, i) => i !== index)
										}),
										children: "Remove skill"
									})
								]
							}, `${skill.name}-${index}`))
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold",
						children: "Education"
					}), result.education.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 list-disc pl-6",
						children: result.education.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: [
							e.degree,
							e.institution,
							e.graduation_year
						].filter(Boolean).join(" — ") }, i))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-slate-600",
						children: "No education entries were confidently extracted."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold",
						children: "Projects"
					}), result.projects.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 list-disc pl-6",
						children: result.projects.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: p.name }), p.description ? ` — ${p.description}` : ""] }, i))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-slate-600",
						children: "No projects were confidently extracted."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onSave,
						disabled: busy,
						className: "rounded-lg bg-violet-600 px-5 py-3 font-semibold text-white disabled:opacity-50",
						children: busy ? "Saving..." : "Save candidate profile"
					})
				]
			})
		]
	});
}
function ResumeParserPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeParser, {});
}
//#endregion
export { ResumeParserPage as component };
