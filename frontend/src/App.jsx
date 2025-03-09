
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register'; 
import Books from './components/Books';
import { AuthProvider } from './contexts/AuthContext';

const Home = () => <div>Bienvenido a la aplicación de Libros</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/libros" element={<Books />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
