from sqlalchemy import Column, Integer, Date, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class Inscripcion(Base):
    __tablename__ = "inscripciones"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    materia_id = Column(Integer, ForeignKey("materias.id"), nullable=False)
    fecha_inscripcion = Column(Date, server_default=func.now())

    usuario = relationship("Usuario", back_populates="inscripciones")
    materia = relationship("Materia", back_populates="inscripciones")
    calificaciones = relationship("Calificacion", back_populates="inscripcion")