import { useState, useEffect } from 'react'
import SectionHeader from "@/components/SectionHeader"
import { Check } from "lucide-react"
import { Link } from "react-router-dom"
import { supabase, isConfigured } from '@/lib/supabase'
import type { PricingTier, PricingAddon } from '@/lib/db.types'

const Pricing = () => {
  const [tiers, setTiers] = useState<PricingTier[]>([])
  const [addons, setAddons] = useState<PricingAddon[]>([])

  useEffect(() => {
    if (!isConfigured) return
    Promise.all([
      supabase!.from('pricing_tiers').select('*').order('order_index'),
      supabase!.from('pricing_addons').select('*').order('order_index'),
    ]).then(([t, a]) => {
      if (t.data) setTiers(t.data)
      if (a.data) setAddons(a.data)
    })
  }, [])

  return (
    <>
      <section className="container py-16 md:py-24">
        <SectionHeader
          eyebrow="Pricing"
          align="center"
          title={<>Honest pricing. <em className="italic font-normal">No surprises.</em></>}
          description="Transparent base rates. The more you press, the less you pay."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <article
              key={t.id}
              aria-labelledby={`tier-${t.id}`}
              className={`relative flex flex-col border p-8 ${
                t.featured ? "bg-ink text-paper border-ink" : "bg-paper border-ink/20"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-8 bg-stamp px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-paper">
                  Most Popular
                </span>
              )}
              <h3 id={`tier-${t.id}`} className="font-display text-2xl font-bold">{t.name}</h3>
              <p className={`mt-2 text-sm ${t.featured ? "text-paper/70" : "text-muted-foreground"}`}>
                {t.description}
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-5xl font-black">{t.price}</span>
                <span className={`font-mono text-xs uppercase tracking-[0.2em] ${t.featured ? "text-paper/60" : "text-muted-foreground"}`}>
                  {t.unit}
                </span>
              </div>
              <ul className="mt-8 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check size={16} className={t.featured ? "text-stamp" : "text-ink"} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`mt-8 block py-3 text-center font-mono text-xs uppercase tracking-[0.2em] transition ${
                  t.featured
                    ? "bg-paper text-ink hover:bg-stamp hover:text-paper"
                    : "border border-ink hover:bg-ink hover:text-paper"
                }`}
              >
                Get a quote
              </Link>
            </article>
          ))}
        </div>
      </section>

      {addons.length > 0 && (
        <section className="container pb-20">
          <h3 className="font-display text-3xl font-bold md:text-4xl">Add-ons & extras</h3>
          <div className="mt-8 grid gap-px bg-ink/15 md:grid-cols-2">
            {addons.map((a) => (
              <div key={a.id} className="flex items-center justify-between bg-paper px-6 py-5">
                <span className="font-display text-lg">{a.name}</span>
                <span className="font-mono text-sm">{a.price}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
            * Prices in JMD. 50% deposit required for orders over 10 pieces. Final pricing
            confirmed after order review. Contact us for bulk enquiries.
          </p>
        </section>
      )}
    </>
  )
}

export default Pricing
