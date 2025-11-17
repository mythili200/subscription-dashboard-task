import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./ThemeContext";
import ThemeBackground from "./ThemeBackround";
import Loader from "./components/Loader";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Plans = lazy(() => import("./pages/Plans"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminSubscriptions = lazy(() => import("./pages/AdminSubscriptions"));

function App() {
  return (
    <ThemeProvider>
      <ThemeBackground />
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<Loader />}>
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
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
