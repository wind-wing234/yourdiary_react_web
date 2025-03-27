import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css';
import Login from './pages/Login.tsx';
import DiaryApp from './pages/DiaryApp.tsx';
import reportWebVitals from './reportWebVitals.js';
import { AuthProvider } from './context/AuthContext.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/diary" element={<DiaryApp />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
