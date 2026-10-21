import { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, getCurrentUser, logoutUser } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // وقتی سایت لود میشه، چک میکنیم کاربر لاگین هست یا نه
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token')
      if (token) {
        try {
          const userData = await getCurrentUser()
          setUser(userData)
        } catch (err) {
          logoutUser() // اگه توکن منقضی شده بود، پاکش کن
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (username, password) => {
    try {
      await loginUser(username, password)
      const userData = await getCurrentUser()
      setUser(userData)
      return { success: true, user: userData }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  // چک کردن نقش‌ها
  const isAdmin = user?.is_staff === true
  const isSeller = user?.is_seller === true

  return (
    <AuthContext.Provider value={{ user, isAdmin, isSeller, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
