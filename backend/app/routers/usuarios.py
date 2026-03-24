from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.models.usuario import Usuario

from app.schemas.usuario import (
    UsuarioCreate,
    UsuarioLogin,
    UsuarioResponse,
    UsuarioUpdate,
    Token,
)

from app.auth import (
    hashear_password,
    verificar_password,
    crear_token,
    get_usuario_actual,
    get_admin_actual,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"],
)

@router.post(
    "/registro",
    response_model=UsuarioResponse,
    status_code=status.HTTP_201_CREATED,

)
def registrar_usuario(datos: UsuarioCreate, db: Session = Depends(get_db)):

    usuario_existente = db.query(Usuario).filter(Usuario.email == datos.email).first()
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario registrado con ese email.",
        )

    password_seguro = hashear_password(datos.password)
    nuevo_usuario = Usuario(
        nombre=datos.nombre,
        email=datos.email,
        password_hash=password_seguro,
        rol=datos.rol,

    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return nuevo_usuario

@router.post("/login", response_model=Token)
def login(datos: UsuarioLogin, db: Session = Depends(get_db)):

    usuario = db.query(Usuario).filter(Usuario.email == datos.email).first()

    if not usuario:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verificar_password(datos.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            headers={"WWW-Authenticate": "Bearer"},
        )
    tiempo_expiracion = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = crear_token(
        data={
            "sub": usuario.email,
            "rol": usuario.rol,
            "id": usuario.id,
        },
        expires_delta=tiempo_expiracion,
    )
    return {
        "access_token": token,
        "token_type": "bearer",

    }

@router.get("/perfil", response_model=UsuarioResponse)
def ver_perfil(usuario_actual: Usuario = Depends(get_usuario_actual)):
    return usuario_actual

@router.get("/", response_model=list[UsuarioResponse])
def listar_usuarios(
    admin: Usuario = Depends(get_admin_actual),
    db: Session = Depends(get_db),
):

    usuarios = db.query(Usuario).all()


    return usuarios

@router.put("/{usuario_id}", response_model=UsuarioResponse)
def actualizar_usuario(
    usuario_id: int,

    datos: UsuarioUpdate,

    usuario_actual: Usuario = Depends(get_usuario_actual),

    db: Session = Depends(get_db),
):

    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()

    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró un usuario con id {usuario_id}.",
        )

    if usuario_actual.id != usuario_id and usuario_actual.rol != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para modificar este perfil.",
        )

    if datos.nombre is not None:
        usuario.nombre = datos.nombre

    if datos.email is not None:
        email_en_uso = db.query(Usuario).filter(
            Usuario.email == datos.email,
            Usuario.id != usuario_id
            
        ).first()

        if email_en_uso:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ese email ya está registrado por otro usuario.",
            )
        usuario.email = datos.email

    if datos.password is not None:
        usuario.password_hash = hashear_password(datos.password)
        

    db.commit()
    db.refresh(usuario)

    return usuario