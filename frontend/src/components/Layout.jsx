import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import SpaceBackground from './SpaceBackground.jsx'

export default function Layout() {
  const { pathname, hash } = useLocation()

  // اسکرول به بالا در تغییر صفحه، یا به المان هش (مثل #products)
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return (
    <div className="flex min-h-screen flex-col relative">
      {/* لایه پس‌زمینه فضایی */}
      <SpaceBackground />

      <a
        href="#main"
        className="sr-only z-[70] rounded-lg bg-brand-dark px-4 py-2 font-bold text-white focus:not-sr-only focus:fixed focus:right-4 focus:top-4"
      >
        پرش به محتوای اصلی
      </a>
      
      <Header />
      
      {/* محتوا با z-10 روی پس‌زمینه قرار می‌گیرد */}
      <main id="main" tabIndex={-1} className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 outline-none">
        <Outlet />
      </main>
      
      <footer className="glass relative z-10 mt-10 border-x-0 border-b-0 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        © فروشگاه هوشمند — نسخه ۱
      </footer>
    </div>
  )
}
