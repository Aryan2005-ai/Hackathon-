"""JD Analytics API: upload/paste, extract, validate, edit and save."""
from __future__ import annotations
from typing import Any, Literal
from uuid import UUID
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel, Field
from app.services.jd_service import CATEGORIES, JDAnalysisError, JDConfigurationError, analyze_jd, extract_text, save_analysis, normalize_skill

router = APIRouter(prefix="/api/jd-analytics", tags=["JD Analytics"])


class SkillInput(BaseModel):
    skill_name: str = Field(min_length=1, max_length=120)
    normalized_skill_name: str = Field(min_length=1, max_length=120)
    skill_category: str
    requirement_type: Literal["required", "preferred", "soft_skill"] = "required"
    required_level: Literal["beginner", "intermediate", "advanced", "expert"] | None = None
    importance_weight: float = Field(ge=0, le=1, default=0.5)
    evidence_text: str = Field(max_length=2000)
    evidence_valid: bool = False
    confidence: float = Field(ge=0, le=1, default=0)
    validation_warnings: list[str] = []


class AnalysisInput(BaseModel):
    company_name: str = ""
    job_title: str = ""
    summary: str = ""
    description_text: str = Field(min_length=40, max_length=100000)
    skills: list[SkillInput]
    source_type: Literal["pdf", "docx", "pasted_text"] = "pasted_text"
    job_location: str | None = None
    employment_type: str | None = None
    created_by: UUID | None = None


@router.get("/categories")
def categories():
    return {"categories": [{"code": k, "label": v} for k, v in CATEGORIES.items()]}


def _analyze(text: str, company: str, title: str):
    try:
        return analyze_jd(text, company, title)
    except JDConfigurationError as exc:
        raise HTTPException(503, detail={"code": "configuration_required", "message": str(exc)}) from exc
    except ValueError as exc:
        raise HTTPException(422, detail={"code": "invalid_input", "message": str(exc)}) from exc
    except JDAnalysisError as exc:
        raise HTTPException(502, detail={"code": "analysis_failed", "message": str(exc)}) from exc


@router.post("/analyze")
async def analyze(
    file: UploadFile | None = File(default=None),
    text: str | None = Form(default=None),
    company_name: str = Form(default=""),
    job_title: str = Form(default=""),
):
    """Analyze pasted text or a PDF/DOCX upload. Requires a configured LLM."""
    if file is not None and text and text.strip():
        raise HTTPException(422, detail={"code": "ambiguous_input", "message": "Provide either a file or pasted text, not both."})
    source_type = "pasted_text"
    if file is not None:
        filename = file.filename or ""
        suffix = filename.lower().rsplit(".", 1)[-1] if "." in filename else ""
        if suffix not in {"pdf", "docx"}:
            raise HTTPException(415, detail={"code": "unsupported_file", "message": "Upload a PDF or DOCX file."})
        content = await file.read()
        if len(content) > 12 * 1024 * 1024:
            raise HTTPException(413, detail={"code": "file_too_large", "message": "Maximum upload size is 12 MB."})
        try:
            text_value = extract_text(filename, content)
        except ValueError as exc:
            raise HTTPException(422, detail={"code": "document_read_failed", "message": str(exc)}) from exc
        source_type = suffix
    else:
        text_value = (text or "").strip()
        if not text_value:
            raise HTTPException(422, detail={"code": "missing_input", "message": "Upload a PDF/DOCX file or paste the job description text."})
    result = _analyze(text_value, company_name, job_title)
    result["source_type"] = source_type
    return result


@router.post("/save")
def save(payload: AnalysisInput):
    """Save the edited analysis. Evidence is revalidated server-side before persistence."""
    text = payload.description_text
    clean_skills = []
    for s in payload.skills:
        item = normalize_skill(s.model_dump(), text)
        if item:
            clean_skills.append(item)
    analysis: dict[str, Any] = {
        "company_name": payload.company_name,
        "job_title": payload.job_title,
        "summary": payload.summary,
        "description_text": text,
        "skills": clean_skills
    }
    try:
        saved = save_analysis(
            analysis,
            payload.source_type,
            str(payload.created_by) if payload.created_by else None,
            payload.job_location,
            payload.employment_type
        )
        return {"success": True, **saved}
    except JDConfigurationError as exc:
        raise HTTPException(503, detail={"code": "configuration_required", "message": str(exc)}) from exc
    except Exception as exc:
        raise HTTPException(500, detail={"code": "save_failed", "message": f"Could not save the analysis to Supabase: {str(exc)[:300]}"}) from exc