import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute() {
  // 👈 حالا هم ادمین و هم فروشنده رو چک میکنیم
  const { isAdmin, isSeller } = useAuth() 
  const location = useLocation()

  // اگه نه ادمین بود نه فروشنده، بفرستش صفحه لاگین
  if (!isAdmin && !isSeller) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // اگه لاگین بود، اجازه بده بره داخل
  return <Outlet />
}
