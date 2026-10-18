import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('UI error:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div className="glass-card max-w-md space-y-4 p-8">
          <h1 className="text-xl font-extrabold">مشکلی پیش آمد 😕</h1>
          <p className="text-sm text-slate-400">
            خطای غیرمنتظره‌ای رخ داد. صفحه را دوباره بارگذاری کنید؛ اطلاعات سبد خرید شما حفظ می‌شود.
          </p>
          <button className="btn-brand" onClick={() => window.location.assign('/')}>
            بازگشت به خانه
          </button>
        </div>
      </div>
    )
  }
}
