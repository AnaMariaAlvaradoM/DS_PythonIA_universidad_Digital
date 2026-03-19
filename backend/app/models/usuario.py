from sqlalchemy import Column, Integer, String, DateTime, func, Index
from sqlalchemy.orm import relationship
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    rol = Column(String, default="estudiante")
    created_at = Column(DateTime, server_default=func.now())

    inscripciones = relationship("Inscripcion", back_populates="usuario")

    