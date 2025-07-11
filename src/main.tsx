import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './Pages/Login';
import './index.css';
import Toast from './components/Toast';

import Register from './Pages/Register';
import DashboardPage from './Pages/Dashboard';
import CourseDetailsPage from './Pages/CourseDetailsPage';
import CourseInstructorsPage from './Pages/ManagerInstructorsPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses/:id" element={<CourseDetailsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/courses" element={<DashboardPage />} />
        <Route
          path="/courses/:id/instructors"
          element={<CourseInstructorsPage />}
        />
        <Route path="/" element={<DashboardPage />} />
      </Routes>
      <Toast />
    </BrowserRouter>
  </React.StrictMode>,
);
