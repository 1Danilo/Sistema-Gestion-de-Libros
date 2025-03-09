from sqlalchemy.orm import Session
from models import Usuario, Libro
from schemas import UsuarioCreate, LibroCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Usuarios
def get_usuario_by_email(db: Session, email: str):
    return db.query(Usuario).filter(Usuario.email == email).first()

def create_usuario(db: Session, usuario: UsuarioCreate):
    hashed_password = pwd_context.hash(usuario.password)
    db_usuario = Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        hashed_password=hashed_password
    )
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

# Libros
def get_libros_by_usuario(db: Session, usuario_id: int, skip: int = 0, limit: int = 10):
    return db.query(Libro).filter(Libro.propietario_id == usuario_id).offset(skip).limit(limit).all()

def create_libro(db: Session, libro: LibroCreate, usuario_id: int):
    db_libro = Libro(**libro.dict(), propietario_id=usuario_id)
    db.add(db_libro)
    db.commit()
    db.refresh(db_libro)
    return db_libro
