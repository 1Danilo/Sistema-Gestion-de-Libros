
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

const AddBookModal = ({ open, onClose, onAdd }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleAdd = () => {
    onAdd({ nombre, descripcion });
    // Reiniciar campos si se desea
    setNombre('');
    setDescripcion('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Agregar Libro</DialogTitle>
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
        <Button onClick={handleAdd} variant="contained">
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBookModal;
