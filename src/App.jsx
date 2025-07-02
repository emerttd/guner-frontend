"use client"

// src/App.jsx

import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import OrdersPage from "./pages/OrdersPage"
import CreateOrderPage from "./pages/CreateOrderPage"
import BranchPage from "./pages/BranchPage"
import UserPage from "./pages/UserPage"
import DashboardPage from "./pages/DashboardPage"
import Layout from "./components/Layout"
import "./App.css"

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token")
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />
}

const App = () => {
  // This state is used to re-render the app on login/logout
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"))

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  // Listen for storage changes to sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"))
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-order"
          element={
            <PrivateRoute>
              <CreateOrderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/branches"
          element={
            <PrivateRoute>
              <BranchPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UserPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/orders" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
