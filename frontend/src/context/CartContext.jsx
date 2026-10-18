import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { MAX_QTY, getProduct } from '../data/products.js'

const CartContext = createContext(null)
const STORAGE_KEY = 'smartshop_cart_v1'

const clampQty = (n) => Math.min(MAX_QTY, Math.max(1, Math.floor(Number(n)) || 1))

// داده‌ی localStorage قابل دستکاری است؛ نام و قیمت همیشه از کاتالوگ خوانده می‌شود.
function sanitize(raw) {
  if (!Array.isArray(raw)) return []
  const seen = new Set()
  const result = []
  for (const entry of raw) {
    const product = getProduct(entry?.id)
    const qty = Math.floor(Number(entry?.qty))
    if (!product || seen.has(product.id) || !Number.isFinite(qty) || qty < 1) continue
    seen.add(product.id)
    result.push({ id: product.id, name: product.name, price: product.price, qty: clampQty(qty) })
  }
  return result
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const product = getProduct(action.item?.id)
      if (!product) return state
      const qty = clampQty(action.qty)
      const exists = state.find((i) => i.id === product.id)
      if (exists) {
        return state.map((i) => (i.id === product.id ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i))
      }
      return [...state, { id: product.id, name: product.name, price: product.price, qty }]
    }
    case 'DECREASE':
      return state
        .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id)
    case 'CLEAR':
      return []
    case 'SET':
      return sanitize(action.items)
    default:
      return state
  }
}

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? sanitize(JSON.parse(raw)) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [], read)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* حافظه در دسترس نیست */
    }
  }, [items])

  // همگام‌سازی سبد بین تب‌ها
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return
      try {
        dispatch({ type: 'SET', items: e.newValue ? JSON.parse(e.newValue) : [] })
      } catch {
        /* نادیده بگیر */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
      addItem: (item, qty = 1) => dispatch({ type: 'ADD', item, qty }),
      decrease: (id) => dispatch({ type: 'DECREASE', id }),
      removeItem: (id) => dispatch({ type: 'REMOVE', id }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    [items]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
