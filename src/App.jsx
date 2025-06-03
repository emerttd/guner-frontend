// src/App.jsx

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OrdersPage from './pages/OrdersPage';
import CreateOrderPage from './pages/CreateOrderPage';
import BranchPage from './pages/BranchPage';
import UserPage from './pages/UserPage';
import DashboardPage from './pages/DashboardPage';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={() => setToken(localStorage.getItem('token'))} />} />
        <Route path="/orders" element={token ? <OrdersPage /> : <Navigate to="/login" />} />
        <Route path="/create-order" element={token ? <CreateOrderPage /> : <Navigate to="/login" />} />
        <Route path="/branches" element={token ? <BranchPage /> : <Navigate to="/login" />} />
        <Route path="/users" element={token ? <UserPage /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={token ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={token ? "/orders" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
