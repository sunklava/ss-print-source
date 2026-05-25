import { useState, useEffect, useRef } from 'react'
import SectionHeader from "@/components/SectionHeader"
import { supabase, isConfigured } from '@/lib/supabase'
import type { Product, ProductColor } from '@/lib/db.types'
import { useCart, parsePrice } from '@/lib/cart'
import { ShoppingBag, ChevronDown } from 'lucide-react'

type ColorsByProduct = Record<string, ProductColor[]>

function ProductCard({ p, colors, onAddToCart }: {
  p: Product
  colors: ProductColor[]
  onAddToCart: (id: string, name: string, price: number, priceDisplay: string, image_url: string | null, category: string) => void
}) {
  // null = base product image selected
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null)
  const [hoverColor, setHoverColor] = useState<ProductColor | null>(null)
  const [hoverDefault, setHoverDefault] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
        setHoverColor(null)
        setHoverDefault(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  const defaultOptionLabel = p.default_option_name ?? p.name

  // hoverDefault overrides everything — shows base product image even when a colour is selected
  const activeColor = hoverDefault ? null : (hoverColor ?? selectedColor)
  const displayLabel = selectedColor?.name ?? defaultOptionLabel

  const handleAddToCart = () => {
    const cartId = selectedColor ? `${p.id}-${selectedColor.id}` : p.id
    const cartName = selectedColor ? selectedColor.name : defaultOptionLabel
    const cartImage = selectedColor?.image_url ?? p.image_url
    onAddToCart(cartId, cartName, parsePrice(p.price), p.price, cartImage, p.category)
  }

  const selectColor = (c: ProductColor | null) => {
    setSelectedColor(c)
    setHoverColor(null)
    setHoverDefault(false)
    setDropdownOpen(false)
  }

  return (
    <div className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep">
        {/* Base product image — visible when no colour (or active colour has no image) */}
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.name}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover [transition:opacity_150ms_ease,transform_500ms_ease] group-hover:scale-105 ${
              !activeColor || !activeColor.image_url ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ objectPosition: p.image_position ?? 'center' }}
          />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ${
            !activeColor || !activeColor.image_url ? 'opacity-100' : 'opacity-0'
          }`}>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              No image
            </span>
          </div>
        )}

        {/* Colour layers — pre-rendered so the browser fetches them all upfront; switching is a pure CSS opacity crossfade */}
        {colors.filter(c => c.image_url).map(c => (
          <img
            key={c.id}
            src={c.image_url!}
            alt={c.name}
            className={`absolute inset-0 h-full w-full object-cover [transition:opacity_150ms_ease,transform_500ms_ease] group-hover:scale-105 ${
              activeColor?.id === c.id ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ objectPosition: c.image_position ?? 'center' }}
          />
        ))}

        {p.tag && (
          <span className="absolute left-3 top-3 bg-ink px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-paper">
            {p.tag}
          </span>
        )}
        <button
          onClick={handleAddToCart}
          aria-label={`Add ${displayLabel} to cart`}
          className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 translate-y-2 bg-paper py-3 font-mono text-[11px] uppercase tracking-[0.2em] opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 hover:bg-ink hover:text-paper focus:translate-y-0 focus:opacity-100"
        >
          <ShoppingBag size={12} aria-hidden="true" /> Add to Cart
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

        {colors.length > 0 && (
          <div ref={dropdownRef} className="relative mt-2">
            {/* Trigger */}
            <button
              type="button"
              onClick={() => setDropdownOpen(prev => !prev)}
              className="flex w-full items-center justify-between border border-ink/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] transition hover:border-ink"
            >
              <span>{displayLabel}</span>
              <ChevronDown size={11} className={`shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown list */}
            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-20 border border-t-0 border-ink/20 bg-paper shadow-sm">
                {/* Default / base image option */}
                <button
                  type="button"
                  onMouseEnter={() => { setHoverDefault(true); setHoverColor(null) }}
                  onMouseLeave={() => setHoverDefault(false)}
                  onClick={() => selectColor(null)}
                  className={`w-full px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.1em] transition ${
                    !selectedColor ? 'bg-ink text-paper' : 'hover:bg-paper-deep'
                  }`}
                >
                  {defaultOptionLabel}
                </button>
                {colors.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onMouseEnter={() => setHoverColor(c)}
                    onMouseLeave={() => setHoverColor(null)}
                    onClick={() => selectColor(c)}
                    className={`w-full px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.1em] transition ${
                      selectedColor?.id === c.id ? 'bg-ink text-paper' : 'hover:bg-paper-deep'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

type GenderTab = 'all' | 'men' | 'women'

const GENDER_TABS: { value: GenderTab; label: string }[] = [
  { value: 'all',   label: 'All' },
  { value: 'men',   label: "Men's" },
  { value: 'women', label: "Women's" },
]

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [colorsByProduct, setColorsByProduct] = useState<ColorsByProduct>({})
  const [gender, setGender] = useState<GenderTab>('all')
  const [category, setCategory] = useState("All")
  const { addItem } = useCart()

  useEffect(() => {
    if (!isConfigured) return
    Promise.all([
      supabase!.from('products').select('*').eq('active', true).order('order_index'),
      supabase!.from('product_colors').select('*').order('order_index'),
    ]).then(([{ data: prods }, { data: cols }]) => {
      if (prods) setProducts(prods)
      if (cols) {
        const map: ColorsByProduct = {}
        for (const c of cols as ProductColor[]) {
          if (!map[c.product_id]) map[c.product_id] = []
          map[c.product_id].push(c)
        }
        setColorsByProduct(map)
      }
    })
  }, [])

  const byGender = gender === 'all'
    ? products
    : products.filter(p => p.gender === gender || p.gender === 'unisex')

  const cats = ["All", ...Array.from(new Set(byGender.map(p => p.category)))]

  const list = category === "All" ? byGender : byGender.filter(p => p.category === category)

  const handleGenderChange = (g: GenderTab) => {
    setGender(g)
    setCategory("All")
  }

  const handleAddToCart = (id: string, name: string, price: number, priceDisplay: string, image_url: string | null, category: string) => {
    addItem({ id, name, price, priceDisplay, image_url, category })
  }

  return (
    <>
      <section className="container py-16 md:py-24">
        <SectionHeader
          eyebrow="Shop the Collection"
          title={<>The <em className="italic font-normal">collection.</em></>}
          description="Curated essentials from our Kingston collection."
          level={1}
        />

        {/* Gender tabs */}
        <div
          role="tablist"
          aria-label="Shop by section"
          className="mt-10 flex border-b border-ink/20"
        >
          {GENDER_TABS.map(({ value, label }) => (
            <button
              key={value}
              role="tab"
              aria-selected={gender === value}
              onClick={() => handleGenderChange(value)}
              className={`px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] transition border-b-2 -mb-px ${
                gender === value
                  ? 'border-ink text-ink'
                  : 'border-transparent text-muted-foreground hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Category filters */}
        <div
          role="group"
          aria-label="Filter products by category"
          className="mt-6 flex flex-wrap gap-2"
        >
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] transition ${
                category === c ? "bg-ink text-paper" : "border border-ink/20 hover:border-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              colors={colorsByProduct[p.id] ?? []}
              onAddToCart={handleAddToCart}
            />
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
