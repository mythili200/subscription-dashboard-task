import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Plans from "./pages/Plans";
import Dashboard from "./pages/Dashboard";
import AdminSubscriptions from "./pages/AdminSubscriptions";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./ThemeContext";
import "./App.css";
import ThemeBackground from "./ThemeBackround";

function App() {
  return (
    <ThemeProvider>
      <ThemeBackground />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/plans" element={<Plans />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subscriptions"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminSubscriptions />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Plans />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
