import { useState, useEffect } from 'react'
import SectionHeader from "@/components/SectionHeader"
import { supabase, isConfigured } from '@/lib/supabase'
import type { Product } from '@/lib/db.types'
import { useCart, parsePrice } from '@/lib/cart'
import { ShoppingBag } from 'lucide-react'

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [active, setActive] = useState("All")
  const { addItem } = useCart()

  useEffect(() => {
    if (!isConfigured) return
    supabase!.from('products').select('*').eq('active', true).order('order_index')
      .then(({ data }) => { if (data) setProducts(data) })
  }, [])

  const cats = ["All", ...Array.from(new Set(products.map(p => p.category)))]
  const list = active === "All" ? products : products.filter(p => p.category === active)

  const handleAddToCart = (p: Product) => {
    addItem({
      id: p.id,
      name: p.name,
      price: parsePrice(p.price),
      priceDisplay: p.price,
      image_url: p.image_url,
      category: p.category,
    })
  }

  return (
    <>
      <section className="container py-16 md:py-24">
        <SectionHeader
          eyebrow="Shop the Press"
          title={<>The <em className="italic font-normal">collection.</em></>}
          description="Curated essentials, ready to be customized or worn as-is. Every piece pressed in our Kingston studio."
        />

        <div className="mt-10 flex flex-wrap gap-2 border-b border-ink/15 pb-6">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] transition ${
                active === c ? "bg-ink text-paper" : "border border-ink/20 hover:border-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
          {list.map((p) => (
            <div key={p.id} className="group">
              <div className="relative overflow-hidden bg-paper-deep">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="aspect-[4/5] w-full bg-paper-deep flex items-center justify-center">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      No image
                    </span>
                  </div>
                )}
                {p.tag && (
                  <span className="absolute left-3 top-3 bg-ink px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-paper">
                    {p.tag}
                  </span>
                )}
                <button
                  onClick={() => handleAddToCart(p)}
                  className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 translate-y-2 bg-paper py-3 font-mono text-[11px] uppercase tracking-[0.2em] opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 hover:bg-ink hover:text-paper"
                >
                  <ShoppingBag size={12} /> Add to Cart
                </button>
              </div>
              <div className="mt-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {p.category}
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-display text-lg font-semibold">{p.name}</span>
                  <span className="font-mono text-xs">{p.price}</span>
                </div>
              </div>
            </div>
          ))}
          {list.length === 0 && (
            <p className="col-span-full py-16 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              No products available
            </p>
          )}
        </div>
      </section>
    </>
  )
}

export default Shop
