from pydantic import BaseModel
from typing import Optional
from datetime import date

class InscripcionCreate(BaseModel):
    usuario_id: int
    materia_id: int
    periodo: str

class InscripcionResponse(BaseModel):
    id: int
    usuario_id: int
    materia_id: int
    periodo: str
    fecha_inscripcion: Optional[date] = None
  
    class Config:
        from_attributes = True

class InscripcionDetalle(BaseModel):
    id: int
    periodo: str
    fecha_inscripcion: Optional[date] = None

    nombre_materia: Optional[str] = None
    creditos_materia: Optional[int] = None

    class Config:
        from_attributes = True
