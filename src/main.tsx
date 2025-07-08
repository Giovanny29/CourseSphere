import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './Pages/Login';
import Dashboard from './Pages/Dashboard'; // importe sua próxima página
import './index.css';
import Toast from './components/Toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* adicione outras rotas aqui */}
      </Routes>
      <Toast />
    </BrowserRouter>
  </React.StrictMode>,
);
