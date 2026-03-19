from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.materia import Materia
from app.schemas.materia import MateriaCreate, MateriaResponse

router = APIRouter(prefix="/materias", tags=["Materias"])

@router.get("/", response_model=list[MateriaResponse])
def listar_materias(db: Session = Depends(get_db)):
    return db.query(Materia).all()

@router.get("/{materia_id}", response_model=MateriaResponse)
def obtener_materia(materia_id: int, db: Session = Depends(get_db)):
    materia = db.query(Materia).filter(Materia.id == materia_id).first()
    if not materia:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    return materia

@router.post("/", response_model=MateriaResponse)
def crear_materia(datos: MateriaCreate, db: Session = Depends(get_db)):
    nueva = Materia(**datos.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.put("/{materia_id}", response_model=MateriaResponse)
def actualizar_materia(materia_id: int, datos: MateriaCreate, db: Session = Depends(get_db)):
    materia = db.query(Materia).filter(Materia.id == materia_id).first()
    if not materia:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    for campo, valor in datos.model_dump().items():
        setattr(materia, campo, valor)
    db.commit()
    db.refresh(materia)
    return materia

@router.delete("/{materia_id}")
def eliminar_materia(materia_id: int, db: Session = Depends(get_db)):
    materia = db.query(Materia).filter(Materia.id == materia_id).first()
    if not materia:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    db.delete(materia)
    db.commit()
    return {"mensaje": "Materia eliminada correctamente"}