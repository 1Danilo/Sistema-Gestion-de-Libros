
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/register', { nombre, email, password });
      // Redirige al login luego del registro
      navigate('/login');
    } catch (err) {
      setError('Error al registrarse. Verifica que el email no esté registrado.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Regístrate
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleRegister}>
        <TextField
          label="Nombre"
          fullWidth
          margin="normal"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Registrarse
        </Button>
      </form>
    </Container>
  );
};

export default Register;
