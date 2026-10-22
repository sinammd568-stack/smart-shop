import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'smartshop_cart_v2' // نسخه رو تغییر دادیم که کش قبلی پاک بشه

const MAX_QTY = 10

const clampQty = (n) => Math.min(MAX_QTY, Math.max(1, Math.floor(Number(n)) || 1))

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const product = action.item
      if (!product || !product.id) return state
      const qty = clampQty(action.qty)
      const exists = state.find((i) => i.id === product.id)
      
      if (exists) {
        return state.map((i) => (i.id === product.id ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i))
      }
      // ذخیره اطلاعات محصول همراه با عکس
      return [...state, { id: product.id, name: product.name, price: product.price, image: product.image, qty }]
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
      return action.items // دیگه نیازی به sanitize کردن پیچیده نیست
    default:
      return state
  }
}

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [], read)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

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
