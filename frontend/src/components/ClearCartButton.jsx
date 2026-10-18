import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

// دکمه‌ی خالی کردن سبد با تأیید دومرحله‌ای (جلوگیری از حذف ناخواسته)
export default function ClearCartButton({ className = '', children = 'خالی کردن سبد' }) {
  const { clear } = useCart()
  const { toast } = useToast()
  const [asking, setAsking] = useState(false)

  if (!asking) {
    return (
      <button className={className} onClick={() => setAsking(true)}>
        {children}
      </button>
    )
  }

  return (
    <div role="alertdialog" aria-label="تأیید خالی کردن سبد" className="flex flex-wrap items-center gap-3 text-sm">
      <span>مطمئنید؟</span>
      <button
        onClick={() => {
          clear()
          setAsking(false)
          toast('سبد خرید خالی شد')
        }}
        className="font-bold text-red-400 hover:underline"
      >
        بله، خالی کن
      </button>
      <button onClick={() => setAsking(false)} className="text-slate-300 hover:underline">
        انصراف
      </button>
    </div>
  )
}
