import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import AppView from './AppView.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/designer" element={<App />} />
        <Route path="/app" element={<AppView />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
