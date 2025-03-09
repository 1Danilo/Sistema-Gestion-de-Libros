
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

const EditBookModal = ({ open, onClose, onEdit, book }) => {
  const [nombre, setNombre] = useState(book?.nombre || '');
  const [descripcion, setDescripcion] = useState(book?.descripcion || '');

  useEffect(() => {
    if (book) {
      setNombre(book.nombre);
      setDescripcion(book.descripcion);
    }
  }, [book]);

  const handleEdit = () => {
    onEdit({ ...book, nombre, descripcion });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Libro</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nombre del libro"
          fullWidth
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Descripción"
          fullWidth
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleEdit} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBookModal;
