import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import AIChat from './components/AIChat.jsx'
import Home from './pages/Home.jsx'
import ProductPage from './pages/ProductPage.jsx'
import CartPage from './pages/CartPage.jsx'
import Checkout from './pages/Checkout.jsx' // 👈 اضافه شد
import NotFound from './pages/NotFound.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx'
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
          <Route path="/checkout" element={<Checkout />} /> {/* 👈 مسیر جدید */}
          <Route path="/login" element={<Login />} />
          
          {/* مسیرهای محافظت شده */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/seller" element={<SellerDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <AIChat />
    </>
  )
}
