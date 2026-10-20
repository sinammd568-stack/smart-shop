import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, Bot, User, Loader2, Plus, Trash2, RefreshCw, WifiOff } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { fmt, getProduct } from '../data/products.js'

// در صفحه‌های HTTPS اتصال ناامن ws:// توسط مرورگر بلاک می‌شود؛ خودکار به wss:// ارتقا می‌دهیم.
const WS_URL = (() => {
  let url = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/chat/'
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('ws://')) {
    url = `wss://${url.slice(5)}`
  }
  return url
})()

const MAX_LEN = 500
const MAX_RECONNECTS = 6
// کدهایی که سرور عمداً می‌فرستد (سیاست/حجم) و نباید تلاش مجدد شوند
const NO_RETRY_CODES = [1008, 1009]

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  text: 'سلام! 👋 من دستیار خرید هوشمند هستم. بودجه و نیازت را بگو، مثلاً: «هدفون تا ۲ میلیون می‌خوام».',
}

const SUGGESTIONS = ['هدفون تا ۲ میلیون می‌خوام', 'بهترین ساعت هوشمند کدومه؟', 'یه اسپیکر ضدآب پیشنهاد بده']

let idCounter = 0
const nextId = () => `m${Date.now()}_${idCounter++}`

function MiniProduct({ id }) {
  const product = getProduct(id)
  const { addItem } = useCart()
  const { toast } = useToast()
  if (!product) return null
  const Icon = product.icon

  return (
    <div className="glass flex items-center gap-3 rounded-xl p-2.5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand-dark dark:bg-brand/25 dark:text-brand-light">
        <Icon size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <Link to={`/product/${product.id}`} className="block truncate text-xs font-bold hover:text-brand-dark dark:hover:text-brand-light text-slate-800 dark:text-slate-200">
          {product.name}
        </Link>
        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{fmt(product.price)} تومان</p>
      </div>
      <button
        onClick={() => {
          addItem(product)
          toast('به سبد خرید اضافه شد')
        }}
        className="btn-brand !rounded-lg !px-2.5 !py-1.5"
        aria-label={`افزودن ${product.name} به سبد`}
      >
        <Plus size={14} />
      </button>
    </div>
  )
}

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [activated, setActivated] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('closed')
  const [gaveUp, setGaveUp] = useState(false)
  const [retryTick, setRetryTick] = useState(0)
  const [typing, setTyping] = useState(false)
  const [busy, setBusy] = useState(false)
  const [unread, setUnread] = useState(0)

  const wsRef = useRef(null)
  const endRef = useRef(null)
  const inputRef = useRef(null)
  const fabRef = useRef(null)
  const streamIdRef = useRef(null)
  const openRef = useRef(false)

  const show = useCallback(() => {
    setOpen(true)
    setActivated(true)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      show()
      const prompt = e.detail?.prompt
      if (typeof prompt === 'string') setInput(prompt.slice(0, MAX_LEN))
    }
    window.addEventListener('open-ai-chat', handler)
    return () => window.removeEventListener('open-ai-chat', handler)
  }, [show])

  useEffect(() => {
    openRef.current = open
    if (open) setUnread(0)
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        fabRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!activated) return undefined

    let cancelled = false
    let attempts = 0
    let retryTimer = null
    let ws = null

    const connect = () => {
      setStatus('connecting')
      setGaveUp(false)
      ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        attempts = 0
        setStatus('open')
      }

      ws.onmessage = (event) => {
        let data
        try {
          data = JSON.parse(event.data)
        } catch {
          return
        }
        if (!data || typeof data.message !== 'string') return

        if (data.type === 'chunk') {
          setTyping(false)
          if (!streamIdRef.current) {
            const id = nextId()
            streamIdRef.current = id
            setMessages((prev) => [...prev, { id, role: 'assistant', text: data.message }])
          } else {
            const id = streamIdRef.current
            setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: m.text + data.message } : m)))
          }
        } else if (data.type === 'done') {
          const id = streamIdRef.current
          streamIdRef.current = null
          setTyping(false)
          setBusy(false)
          if (!openRef.current) setUnread((n) => n + 1)
          const productIds = Array.isArray(data.product_ids) ? data.product_ids.filter(Number.isInteger) : []
          if (id) {
            setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, productIds } : m)))
          } else {
            setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', text: data.message, productIds }])
          }
        } else if (data.type === 'error') {
          streamIdRef.current = null
          setTyping(false)
          setBusy(false)
          setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', text: data.message, isError: true }])
        }
      }

      ws.onclose = (event) => {
        setStatus('closed')
        setTyping(false)
        setBusy(false)
        streamIdRef.current = null
        if (cancelled) return
        if (NO_RETRY_CODES.includes(event.code) || attempts >= MAX_RECONNECTS) {
          setGaveUp(true)
          return
        }
        attempts += 1
        retryTimer = setTimeout(connect, Math.min(1000 * 2 ** attempts, 10000))
      }

      ws.onerror = () => ws.close()
    }

    connect()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
      if (ws) ws.close()
      wsRef.current = null
    }
  }, [activated, retryTick])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, typing, open])

  useEffect(() => {
    if (open && status === 'open' && window.matchMedia('(min-width: 640px)').matches) {
      inputRef.current?.focus()
    }
  }, [open, status])

  const send = useCallback((text) => {
    const msg = text.trim().slice(0, MAX_LEN)
    const ws = wsRef.current
    if (!msg || !ws || ws.readyState !== WebSocket.OPEN) return
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text: msg }])
    ws.send(JSON.stringify({ message: msg }))
    setTyping(true)
    setBusy(true)
    setInput('')
  }, [])

  const clearChat = () => {
    streamIdRef.current = null
    setMessages([WELCOME])
  }

  const retry = () => setRetryTick((t) => t + 1)

  const onSubmit = (e) => {
    e.preventDefault()
    if (!busy) send(input)
  }

  const statusLabel = status === 'open' ? 'آنلاین' : status === 'connecting' ? 'در حال اتصال…' : 'قطع شده'
  const statusColor = status === 'open' ? 'bg-emerald-500' : status === 'connecting' ? 'bg-amber-500' : 'bg-red-500'

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            role="region"
            aria-label="دستیار خرید هوشمند"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="glass-strong fixed bottom-24 right-4 z-50 flex h-[34rem] max-h-[calc(100dvh-7rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl sm:right-6 border border-slate-200 dark:border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-brand/20 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-dark text-white shadow-md">
                  <Sparkles size={18} />
                </span>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-800 dark:text-white">دستیار خرید هوشمند</h2>
                  <p className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-300">
                    <span className={`h-2 w-2 rounded-full ${statusColor}`} aria-hidden="true" />
                    {statusLabel}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  disabled={busy || messages.length === 1}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white disabled:opacity-40 transition-colors"
                  aria-label="پاک کردن گفتگو"
                  title="پاک کردن گفتگو"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={() => setOpen(false)} 
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition-colors" 
                  aria-label="بستن چت"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              aria-label="پیام‌های گفتگو"
              className="chat-scroll flex-1 space-y-3 overflow-y-auto p-4"
            >
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <span
                    aria-hidden="true"
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                      m.role === 'user' 
                        ? 'bg-slate-200 text-slate-600 dark:bg-white/15 dark:text-white' 
                        : 'bg-brand/20 text-brand-dark dark:bg-brand/40 dark:text-brand-light'
                    }`}
                  >
                    {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </span>
                  <div className="flex max-w-[85%] flex-col gap-2">
                    <div
                      className={`whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm leading-7 ${
                        m.role === 'user'
                          ? 'rounded-tl-sm bg-brand-dark text-white shadow-sm'
                          : m.isError
                          ? 'rounded-tr-sm border border-red-400/30 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200'
                          : 'glass rounded-tr-sm text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {m.text}
                    </div>
                    {m.productIds?.map((pid) => (
                      <MiniProduct key={pid} id={pid} />
                    ))}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Loader2 size={14} className="animate-spin motion-reduce:animate-none" /> در حال نوشتن…
                </div>
              )}

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      disabled={status !== 'open'}
                      className="glass rounded-full px-3 py-1.5 text-xs text-brand-dark transition hover:bg-slate-200 dark:text-brand-light dark:hover:bg-white/10 disabled:opacity-40"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Connection banner */}
            {gaveUp && (
              <div className="flex items-center justify-between gap-2 border-t border-red-400/30 bg-red-50 dark:bg-red-500/10 px-4 py-2 text-xs text-red-600 dark:text-red-200">
                <span className="flex items-center gap-2">
                  <WifiOff size={14} /> اتصال برقرار نشد.
                </span>
                <button onClick={retry} className="inline-flex items-center gap-1 font-bold underline">
                  <RefreshCw size={12} /> تلاش مجدد
                </button>
              </div>
            )}

            {/* Input */}
            <form onSubmit={onSubmit} className="border-t border-slate-200 dark:border-white/10 p-3 bg-white/50 dark:bg-transparent">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={MAX_LEN}
                  disabled={status !== 'open'}
                  autoComplete="off"
                  aria-label="پیام شما"
                  placeholder={status === 'open' ? 'پیامت را بنویس…' : 'در حال برقراری اتصال…'}
                  className="glass min-w-0 flex-1 rounded-xl px-3.5 py-2.5 text-base outline-none placeholder:text-slate-400 focus:border-brand dark:text-white sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={status !== 'open' || !input.trim() || busy}
                  className="btn-brand !px-3 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="ارسال"
                >
                  <Send size={16} className="-scale-x-100" />
                </button>
              </div>
              {input.length > MAX_LEN - 100 && (
                <p className="mt-1.5 text-left text-[11px] text-slate-400" aria-live="polite">
                  {fmt(input.length)} / {fmt(MAX_LEN)}
                </p>
              )}
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* FAB - دکمه شناور قابل جابجایی */}
      <motion.button
        ref={fabRef}
        drag
        dragMomentum={false}
        dragElastic={0.1}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => (open ? setOpen(false) : show())}
        className="fixed bottom-6 right-4 z-50 grid h-14 w-14 cursor-grab active:cursor-grabbing place-items-center rounded-full bg-brand-dark text-white shadow-xl shadow-brand/30 dark:shadow-brand/50 sm:right-6"
        aria-label={open ? 'بستن دستیار خرید' : unread > 0 ? `باز کردن دستیار خرید، ${fmt(unread)} پیام جدید` : 'باز کردن دستیار خرید'}
        aria-expanded={open}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
        {!open && unread === 0 && (
          <span aria-hidden="true" className="absolute inset-0 -z-10 animate-ping rounded-full bg-brand/40 motion-reduce:animate-none" />
        )}
        {!open && unread > 0 && (
          <span aria-hidden="true" className="absolute -left-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[11px] font-bold">
            {fmt(unread)}
          </span>
        )}
      </motion.button>
    </>
  )
}
