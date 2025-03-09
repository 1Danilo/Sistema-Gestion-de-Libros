import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper 
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import AddBookModal from './AddBookModal';
import EditBookModal from './EditBookModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const Books = () => {
  const { usuario } = useContext(AuthContext);
  const [libros, setLibros] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    if (usuario) {
      axios.get(`http://localhost:8000/libros?skip=${pagina * 10}&limit=10`, {
        headers: { Authorization: `Bearer ${usuario.token}` }
      })
      .then(response => {
        setLibros(response.data);
      })
      .catch(error => console.error(error));
    }
  }, [usuario, pagina]);

  // Función para agregar un libro
  const handleAddBook = (newBook) => {
    console.log("Datos del libro a agregar:", newBook);
    axios.post('http://localhost:8000/libros', newBook, {
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${usuario.token}`
      }
    })
    .then(response => {
      console.log("Respuesta del backend:", response.data);
      // Actualizar la lista de libros, agregando el nuevo libro
      setLibros(prev => [...prev, response.data]);
      setOpenAddModal(false);
    })
    .catch(error => {
      console.error("Error al agregar libro:", error);
    });
  };
  

  // Función para abrir el modal de edición
  const handleOpenEditModal = (book) => {
    setBookToEdit(book);
    setOpenEditModal(true);
  };

  // Función para actualizar el libro editado
  const handleEditBook = (updatedBook) => {
    axios.put(`http://localhost:8000/libros/${updatedBook.id}`, updatedBook, {
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${usuario.token}`
      }
    })
    .then(response => {
      setLibros(libros.map(libro => libro.id === updatedBook.id ? response.data : libro));
      setOpenEditModal(false);
    })
    .catch(error => console.error("Error al editar libro:", error));
  };

  // Función para abrir el modal de eliminación
  const handleOpenDeleteModal = (book) => {
    setBookToDelete(book);
    setOpenDeleteModal(true);
  };

  // Función para eliminar el libro
  const handleDeleteBook = () => {
    axios.delete(`http://localhost:8000/libros/${bookToDelete.id}`, {
      headers: {
        Authorization: `Bearer ${usuario.token}`
      }
    })
    .then(() => {
      setLibros(libros.filter(libro => libro.id !== bookToDelete.id));
      setOpenDeleteModal(false);
    })
    .catch(error => console.error("Error al eliminar libro:", error));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mis Libros
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mb: 2 }}
        onClick={() => setOpenAddModal(true)}
      >
        Agregar Libro
      </Button>
      <AddBookModal 
        open={openAddModal} 
        onClose={() => setOpenAddModal(false)} 
        onAdd={handleAddBook} 
      />
      {bookToEdit && (
        <EditBookModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          onEdit={handleEditBook}
          book={bookToEdit}
        />
      )}
      {bookToDelete && (
        <DeleteConfirmationModal
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={handleDeleteBook}
          bookName={bookToDelete.nombre}
        />
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {libros.map(libro => (
              <TableRow key={libro.id}>
                <TableCell>{libro.nombre}</TableCell>
                <TableCell>{libro.descripcion}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    sx={{ mr: 1 }}
                    onClick={() => handleOpenEditModal(libro)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    onClick={() => handleOpenDeleteModal(libro)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button 
        onClick={() => setPagina(pagina - 1)} 
        disabled={pagina === 0} 
        sx={{ mt: 2, mr: 1 }}
      >
        Anterior
      </Button>
      <Button onClick={() => setPagina(pagina + 1)} sx={{ mt: 2 }}>
        Siguiente
      </Button>
    </Container>
  );
};

export default Books;
