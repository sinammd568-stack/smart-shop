import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ allowedRoles }) {
  const { isAdmin, isSeller } = useAuth()
  const location = useLocation()

  // چک میکنیم کاربری که لاگین کرده، اجازه ورود به این مسیر رو داره یا نه
  const isAllowed = 
    (allowedRoles.includes('admin') && isAdmin) ||
    (allowedRoles.includes('seller') && isSeller)

  if (!isAllowed) {
    // اگه ادمین بود ولی خواست بره پنل فروشنده، بفرستش پنل ادمین و برعکس
    if (isAdmin) return <Navigate to="/admin" replace />
    if (isSeller) return <Navigate to="/seller" replace />
    
    // اگه کلاً لاگین نبود، بفرستش صفحه لاگین
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
