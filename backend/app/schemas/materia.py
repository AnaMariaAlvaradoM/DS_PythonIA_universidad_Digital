from pydantic import BaseModel
from typing import Optional


class MateriaCreate(BaseModel):
    nombre: str
    codigo: str
    creditos: int
    descripcion: Optional[str] = None


class MateriaUpdate(BaseModel):
    nombre: Optional[str] = None
    codigo: Optional[str] = None
    creditos: Optional[int] = None
    descripcion: Optional[str] = None


class MateriaResponse(BaseModel):
    id: int
    nombre: str
    codigo: str
    creditos: int
    descripcion: Optional[str] = None

    class Config:
        from_attributes = True