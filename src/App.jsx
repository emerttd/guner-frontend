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

  // Login durumunu izlemek için
  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      setToken(currentToken);
    }, 1500); // yarım saniyede bir kontrol

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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
