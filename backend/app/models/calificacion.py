from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Calificacion(Base):
    __tablename__ = "calificaciones"

    id = Column(Integer, primary_key=True, autoincrement=True)
    inscripcion_id = Column(Integer, ForeignKey("inscripciones.id"), nullable=False)
    nota = Column(Float, nullable=False)
    periodo = Column(String, nullable=False)

    inscripcion = relationship("Inscripcion", back_populates="calificaciones")