import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute() {
  const { isAdmin } = useAuth()
  const location = useLocation()

  if (!isAdmin) {
    // کاربر لاگین نکرده، هدایت به صفحه لاگین
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // کاربر لاگین کرده، اجازه دسترسی به محتوای داخل (مثل داشبورد) رو بده
  return <Outlet />
}
