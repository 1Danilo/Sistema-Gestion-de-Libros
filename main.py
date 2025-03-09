from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from database import SessionLocal, engine, Base
import models, schemas, crud
from crud import pwd_context

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dependencia para obtener la sesión de la DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint para login (recibe datos form-data)
@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = crud.get_usuario_by_email(db, email=form_data.username)
    if not usuario:
        raise HTTPException(status_code=400, detail="Usuario no encontrado")
    if not pwd_context.verify(form_data.password, usuario.hashed_password):
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")
    return {"access_token": usuario.email, "token_type": "bearer"}

# Función para obtener el usuario actual a partir del token
def get_current_usuario(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    usuario = crud.get_usuario_by_email(db, email=token)
    if not usuario:
        raise HTTPException(status_code=401, detail="Token inválido")
    return usuario

# Endpoint para obtener los libros del usuario autenticado (con paginación)
@app.get("/libros", response_model=list[schemas.LibroResponse])
def leer_libros(skip: int = 0, limit: int = 10,
                current_usuario: models.Usuario = Depends(get_current_usuario),
                db: Session = Depends(get_db)):
    libros = crud.get_libros_by_usuario(db, usuario_id=current_usuario.id, skip=skip, limit=limit)
    return libros

# Endpoint para agregar un libro
@app.post("/libros", response_model=schemas.LibroResponse)
def agregar_libro(libro: schemas.LibroCreate,
                  current_usuario: models.Usuario = Depends(get_current_usuario),
                  db: Session = Depends(get_db)):
    return crud.create_libro(db, libro=libro, usuario_id=current_usuario.id)

# Endpoint para registrar un nuevo usuario
@app.post("/register", response_model=schemas.UsuarioResponse)
def register(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    # Verifica si el email ya está registrado
    db_usuario = crud.get_usuario_by_email(db, email=usuario.email)
    if db_usuario:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya se encuentra registrado"
        )
    nuevo_usuario = crud.create_usuario(db, usuario)
    return nuevo_usuario

# Endpoint para actualizar un libro
@app.put("/libros/{libro_id}", response_model=schemas.LibroResponse)
def actualizar_libro(libro_id: int, libro_actualizado: schemas.LibroCreate, 
                     current_usuario: models.Usuario = Depends(get_current_usuario), 
                     db: Session = Depends(get_db)):
    db_libro = db.query(models.Libro).filter(models.Libro.id == libro_id, models.Libro.propietario_id == current_usuario.id).first()
    if not db_libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    db_libro.nombre = libro_actualizado.nombre
    db_libro.descripcion = libro_actualizado.descripcion
    db.commit()
    db.refresh(db_libro)
    return db_libro


# Endpoint para eliminar un libro
@app.delete("/libros/{libro_id}")
def eliminar_libro(libro_id: int, current_usuario: models.Usuario = Depends(get_current_usuario), db: Session = Depends(get_db)):
    db_libro = db.query(models.Libro).filter(models.Libro.id == libro_id, models.Libro.propietario_id == current_usuario.id).first()
    if not db_libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    db.delete(db_libro)
    db.commit()
    return {"detail": "Libro eliminado"}


