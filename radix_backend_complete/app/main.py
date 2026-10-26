from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.jd_analytics import router as jd_analytics_router

app = FastAPI(
    title="RADIX Talent Match API",
    description="Backend API for JSS Placement Intelligence Hub",
    version="1.0.0",
)

# Local development CORS. Restrict allow_origins before production deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jd_analytics_router)


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
        "message": "JD Analytics endpoints are available; remaining feature endpoints are being implemented incrementally.",
    }
