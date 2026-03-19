from pydantic import BaseModel


class CalificacionCreate(BaseModel):
    inscripcion_id: int
    nota: float
    periodo: str


class CalificacionResponse(BaseModel):
    id: int
    inscripcion_id: int
    nota: float
    periodo: str

    class Config:
        from_attributes = True