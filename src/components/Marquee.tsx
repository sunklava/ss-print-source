import { useState, useEffect } from 'react'
import { supabase, isConfigured } from '@/lib/supabase'

const defaultItems = [
  "Premium Apparel",
  "Fast Island Delivery",
  "New Arrivals",
  "Kingston, JA",
  "Quality Fabrics",
  "Shop the Collection",
]

const Marquee = () => {
  const [items, setItems] = useState(defaultItems)

  useEffect(() => {
    if (!isConfigured) return
    supabase!.from('site_content').select('marquee_items').eq('id', 1).single()
      .then(({ data }) => { if (data?.marquee_items?.length) setItems(data.marquee_items) })
  }, [])

  const loop = [...items, ...items]
  return (
    <div className="ticker-mask overflow-hidden border-y border-ink/15 bg-ink py-4 text-paper" aria-hidden="true">
      <div className="marquee flex w-max gap-12 whitespace-nowrap">
        {loop.map((t, i) => (
          <span key={i} className="flex items-center gap-12 font-mono text-xs uppercase tracking-[0.3em]">
            {t}
            <span className="text-stamp">✶</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default Marquee
