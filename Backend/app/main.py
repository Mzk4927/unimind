from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import create_tables, get_db
from .api import student

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(student.router, prefix="/api/student", tags=["Student"])

@app.on_event("startup")
def on_startup():
    create_tables()