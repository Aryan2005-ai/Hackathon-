
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.resume_parser import router as resume_parser_router
from app.api.routes.jd_analytics import router as jd_analytics_router
from app.api.routes.profile_builder import router as profile_builder_router

app = FastAPI(
    title="RADIX Talent Match API",
    description="Backend API for JSS Placement Intelligence Hub",
    version="1.0.0",
)

# Local development CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "RADIX Talent Match backend is running",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api")
def api_info():
    return {
        "features": [
            "jd-analytics",
            "resume-parsing",
            "profile-builder",
            "talent-check",
            "skill-matching",
        ],
        "message": "Feature endpoints are being added incrementally.",
    }


# Register routers
app.include_router(resume_parser_router)
app.include_router(jd_analytics_router)
app.include_router(profile_builder_router)
