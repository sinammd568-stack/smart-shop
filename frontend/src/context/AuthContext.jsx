import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'))
  const [isAdmin, setIsAdmin] = useState(() => !!localStorage.getItem('admin_token'))

  // لاگین (فعلاً به صورت تستی. بعداً به API جنگو وصل میشه)
  const login = async (username, password) => {
    // ⚠️ این یه لاگین تستیه. بعداً با fetch به بک‌اند وصل میشه
    if (username === 'admin' && password === 'admin123') {
      const fakeToken = 'fake-jwt-token-12345'
      localStorage.setItem('admin_token', fakeToken)
      setToken(fakeToken)
      setIsAdmin(true)
      return { success: true }
    } else {
      return { success: false, message: 'نام کاربری یا رمز عبور اشتباه است.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setToken(null)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ isAdmin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
