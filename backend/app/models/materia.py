from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class Materia(Base):
    __tablename__ = "materias"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String, nullable=False)
    codigo = Column(String, unique=True, nullable=False)
    creditos = Column(Integer, nullable=False)
    descripcion = Column(String, nullable=True)

    inscripciones = relationship("Inscripcion", back_populates="materia")