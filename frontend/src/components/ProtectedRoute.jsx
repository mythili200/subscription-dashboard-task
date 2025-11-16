import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, adminOnly=false }){
  const auth = useSelector(state => state.auth);
  if(!auth.user) return <Navigate to="/login" replace />;
  if(adminOnly && auth.user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
