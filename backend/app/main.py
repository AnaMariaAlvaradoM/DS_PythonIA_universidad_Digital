from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

from app.models import usuario, materia, inscripcion, calificacion

from app.routers import materias, usuarios

app = FastAPI(
    title="Universidad Digital API",
    description="Sistema de gestión académica universitaria",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(materias.router)
app.include_router(usuarios.router)

@app.get("/", tags=["Raíz"])
def root():
    return {"mensaje": "Universidad Digital funcionando", "version": "1.0.0"}