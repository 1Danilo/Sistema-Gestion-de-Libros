
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirige a la página de inicio
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Inicio
          </Link>
        </Typography>
        {usuario ? (
          <>
            <Button color="inherit" component={Link} to="/libros">
              Mis Libros
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Desconectar
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Regístrate
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
