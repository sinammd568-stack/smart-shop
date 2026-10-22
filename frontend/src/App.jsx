import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import AIChat from './components/AIChat.jsx'
import Home from './pages/Home.jsx'
import ProductPage from './pages/ProductPage.jsx'
import CartPage from './pages/CartPage.jsx'
import NotFound from './pages/NotFound.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx' // 👈 اضافه شد
import Login from './pages/Login.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/seller" element={<SellerDashboard />} /> {/* 👈 اضافه شد */}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <AIChat />
    </>
  )
}
