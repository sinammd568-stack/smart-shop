import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider> 
        <MotionConfig reducedMotion="user">
          <BrowserRouter>
            <ToastProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </ToastProvider>
          </BrowserRouter>
        </MotionConfig>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
