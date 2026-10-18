import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'

export default function NotFound() {
  usePageTitle('صفحه پیدا نشد')
  return (
    <div className="grid place-items-center gap-4 py-28 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-brand/20 text-brand-light">
        <SearchX size={36} />
      </span>
      <h1 className="text-2xl font-extrabold">صفحه مورد نظر پیدا نشد</h1>
      <p className="text-slate-400">ممکن است آدرس اشتباه باشد یا محصول حذف شده باشد.</p>
      <Link to="/" className="btn-brand">بازگشت به خانه</Link>
    </div>
  )
}
