
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.usuario import Usuario
from app.models.materia import Materia
from app.models.inscripcion import Inscripcion

from app.schemas.inscripcion import InscripcionCreate, InscripcionResponse, InscripcionDetalle
from app.auth import get_usuario_actual, get_admin_actual

router = APIRouter(
    prefix="/inscripciones",
    tags=["Inscripciones"],
)

@router.post("/",
    response_model=InscripcionResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_inscripcion(
    datos: InscripcionCreate,
    admin: Usuario = Depends(get_admin_actual),
    db: Session = Depends(get_db),
):

    usuario = db.query(Usuario).filter(Usuario.id == datos.usuario_id).first()

    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró un usuario con id {datos.usuario_id}.",
        )

    if usuario.rol != "estudiante":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solo se pueden inscribir usuarios con rol 'estudiante'.",
        )

    materia = db.query(Materia).filter(Materia.id == datos.materia_id).first()

    if not materia:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró una materia con id {datos.materia_id}.",
        )

    inscripcion_existente = db.query(Inscripcion).filter(
        Inscripcion.usuario_id == datos.usuario_id,
        Inscripcion.materia_id == datos.materia_id,
        Inscripcion.periodo == datos.periodo,
    ).first()

    if inscripcion_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El estudiante ya está inscrito en esa materia para el período {datos.periodo}.",
        )


    nueva_inscripcion = Inscripcion(
        usuario_id=datos.usuario_id,
        materia_id=datos.materia_id,
        periodo=datos.periodo,
       
    )

    db.add(nueva_inscripcion)
    db.commit()
    db.refresh(nueva_inscripcion)

    return nueva_inscripcion

@router.get("/mis-materias", response_model=list[InscripcionDetalle])
def ver_mis_materias(
    usuario_actual: Usuario = Depends(get_usuario_actual),

    db: Session = Depends(get_db),
):

    inscripciones = db.query(Inscripcion).filter(
        Inscripcion.usuario_id == usuario_actual.id

    ).all()

    resultado = []
    for inscripcion in inscripciones:
        materia = db.query(Materia).filter(Materia.id == inscripcion.materia_id).first()

        resultado.append(InscripcionDetalle(
            id=inscripcion.id,
            periodo=inscripcion.periodo,
           # fecha_inscripcion=inscripcion.fecha_inscripcion,
            nombre_materia=materia.nombre if materia else None,
            creditos_materia=materia.creditos if materia else None,
        ))

    return resultado

@router.get("/", response_model=list[InscripcionResponse])
def listar_inscripciones(
    admin: Usuario = Depends(get_admin_actual),

    db: Session = Depends(get_db),
):

    return db.query(Inscripcion).all()

@router.delete("/{inscripcion_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancelar_inscripcion(
    inscripcion_id: int,
    admin: Usuario = Depends(get_admin_actual),
    db: Session = Depends(get_db),
):
    inscripcion = db.query(Inscripcion).filter(Inscripcion.id == inscripcion_id).first()
    if not inscripcion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró una inscripción con id {inscripcion_id}.",
        )
    db.delete(inscripcion)
    db.commit()