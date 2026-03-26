from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.materia import Materia
from app.models.usuario import Usuario
from app.schemas.materia import MateriaCreate, MateriaUpdate, MateriaResponse

from app.auth import get_usuario_actual, get_admin_actual
router = APIRouter(
    prefix="/materias",
    tags=["Materias"],
)

@router.get("/", response_model=list[MateriaResponse])
def listar_materias(
    usuario_actual: Usuario = Depends(get_usuario_actual),
    db: Session = Depends(get_db),
):
    return db.query(Materia).all()

@router.get("/{materia_id}", response_model=MateriaResponse)
def obtener_materia(
    materia_id: int,
    
    usuario_actual: Usuario = Depends(get_usuario_actual),
    
    db: Session = Depends(get_db),
):
 
    materia = db.query(Materia).filter(Materia.id == materia_id).first()

    if not materia:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró una materia con id {materia_id}.",
        )

    return materia

@router.post(
    "/",
    response_model=MateriaResponse,
    status_code=status.HTTP_201_CREATED,
    
)
def crear_materia(
    datos: MateriaCreate,
    admin: Usuario = Depends(get_admin_actual),

    db: Session = Depends(get_db),
):
 
    nueva = Materia(**datos.model_dump())
   
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
   
    return nueva

@router.put("/{materia_id}", response_model=MateriaResponse)
def actualizar_materia(
    materia_id: int,
    datos: MateriaUpdate,
    admin: Usuario = Depends(get_admin_actual),
   
    db: Session = Depends(get_db),
):
  
    materia = db.query(Materia).filter(Materia.id == materia_id).first()

    if not materia:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró una materia con id {materia_id}.",
        )

    for campo, valor in datos.model_dump(exclude_none=True).items():
        setattr(materia, campo, valor)
    db.commit()
    db.refresh(materia)
    return materia

@router.delete("/{materia_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_materia(
    materia_id: int,
    admin: Usuario = Depends(get_admin_actual),
   
    db: Session = Depends(get_db),
):

    materia = db.query(Materia).filter(Materia.id == materia_id).first()

    if not materia:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró una materia con id {materia_id}.",
        )

    db.delete(materia)
    db.commit()