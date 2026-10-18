import { useEffect } from 'react'

const BASE = 'فروشگاه هوشمند'

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : `${BASE} | خرید با کمک هوش مصنوعی`
  }, [title])
}
