from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import calculator, auth

app = FastAPI(
    title="Respira+ API",
    description="API for Respira+ Carbon Footprint Tracker",
    version="0.1.0",
)

# CORS setup for web frontend (Expo Web on localhost ports)
origins = [
    "http://localhost:8081",
    "http://localhost:8082",
    "http://127.0.0.1:8081",
    "http://127.0.0.1:8082",
    "http://localhost",
    "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(calculator.router, prefix="/api/calculate", tags=["calculator"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Respira+ API"}
