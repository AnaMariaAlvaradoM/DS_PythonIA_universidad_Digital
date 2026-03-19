import pytest
from pydantic import ValidationError
from backend.app.schemas.materia import (
    MateriaCreate,
    MateriaUpdate,
    MateriaResponse,
)


def test_create_valid_materia():
    data = {
        "nombre": "Matemáticas",
        "codigo": "MAT101",
        "creditos": 4,
        "descripcion": "Introducción a las matemáticas",
    }
    m = MateriaCreate(**data)
    assert m.nombre == data["nombre"]
    assert m.codigo == data["codigo"]
    assert m.creditos == data["creditos"]
    assert m.descripcion == data["descripcion"]


def test_create_missing_required_fields_raises():
    data = {"nombre": "Física"}
    with pytest.raises(ValidationError):
        MateriaCreate(**data)


def test_update_allows_partial_fields():
    data = {"creditos": 3}
    m = MateriaUpdate(**data)
    assert m.creditos == 3
    assert m.nombre is None
    assert m.codigo is None


def test_response_parses_from_attributes():
    class Dummy:
        def __init__(self):
            self.id = 1
            self.nombre = "Química"
            self.codigo = "QUI201"
            self.creditos = 5
            self.descripcion = None

    d = Dummy()
    resp = MateriaResponse.from_orm(d) if hasattr(MateriaResponse, 'from_orm') else MateriaResponse(**d.__dict__)
    assert resp.id == 1
    assert resp.nombre == "Química"
    assert resp.codigo == "QUI201"
    assert resp.creditos == 5
    assert resp.descripcion is None


def test_field_type_enforcement_raises_on_wrong_type():
    data = {
        "nombre": "Historia",
        "codigo": "HIS100",
        "creditos": "not-an-int",
    }
    with pytest.raises(ValidationError):
        MateriaCreate(**data)
