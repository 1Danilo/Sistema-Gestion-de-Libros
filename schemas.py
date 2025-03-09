from pydantic import BaseModel, EmailStr

# Usuario
class UsuarioCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str

class UsuarioResponse(BaseModel):
    id: int
    nombre: str
    email: EmailStr

    class Config:
        from_attributes = True

# Libro
class LibroBase(BaseModel):
    nombre: str
    descripcion: str

class LibroCreate(LibroBase):
    pass

class LibroResponse(LibroBase):
    id: int
    propietario_id: int

    class Config:
        from_attributes = True
