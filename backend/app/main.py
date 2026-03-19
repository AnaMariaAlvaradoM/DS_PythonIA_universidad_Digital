from app.models import usuario, materia, calificacion, inscripcion
from app.database import Base, engine
from app.routers import materias
from fastapi import FastAPI

app = FastAPI(
    title="Universidad Digital API",
    description="Sistema de gestión académica",
    version="1.0.0"
)
Base.metadata.create_all(bind=engine)
app.incluide_router(materias.router)

@app.get("/")
def root():
    return {"mensaje": "Universidad Digital API funcionando"}