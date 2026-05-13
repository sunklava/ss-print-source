import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { ArrowRight, Palette, Truck, Sparkles } from "lucide-react"
import hero from "@/assets/ss_print_hero_image_resized_900x1050.jpg"
import workshop from "@/assets/workshop.jpg"
import Marquee from "@/components/Marquee"
import SectionHeader from "@/components/SectionHeader"
import { supabase, isConfigured } from '@/lib/supabase'
import type { Product, SiteContent } from '@/lib/db.types'

const defaultContent: Omit<SiteContent, 'id'> = {
  hero_eyebrow: 'Vol. 01 — Spring Press',
  hero_heading: 'Wear your ideas.',
  hero_subtext: 'Apparel & print out of Jamaica. From a single tee to a full team kit — pressed sharp, fast, and built to last.',
  hero_image_url: null,
  workshop_image_url: null,
  stats: [
    { key: '500+', label: 'Pieces Pressed' },
    { key: '48h', label: 'Avg. Turnaround' },
    { key: '100%', label: 'Quality' },
  ],
  marquee_items: [],
  contact_phone: '',
  contact_email: '',
  contact_hours: '',
  footer_tagline: '',
}

const steps = [
  { n: "01", icon: Palette, title: "Browse the catalogue", body: "Shop our curated selection of apparel and accessories, each piece pressed in our Kingston studio." },
  { n: "02", icon: Sparkles, title: "Checkout securely", body: "Easy PayPal payments. Your order is confirmed instantly with no back-and-forth." },
  { n: "03", icon: Truck, title: "Pickup or delivery", body: "Fast turnaround across the island. One piece or one thousand." },
]

const Home = () => {
  const [content, setContent] = useState(defaultContent)
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    if (!isConfigured) return
    supabase!.from('site_content').select('*').eq('id', 1).single()
      .then(({ data }) => { if (data) setContent(data) })
    supabase!.from('products').select('*').eq('active', true).order('order_index').limit(4)
      .then(({ data }) => { if (data) setFeatured(data) })
  }, [])

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container grid items-center gap-10 py-12 md:grid-cols-12 md:gap-16 md:py-20">
          <div className="md:col-span-6 reveal-up">
            <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <span className="h-px w-8 bg-ink/40" />
              {content.hero_eyebrow}
            </div>
            <h1 className="font-display text-[3.2rem] font-black leading-[0.95] tracking-tight md:text-[6.5rem]">
              {content.hero_heading}
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              {content.hero_subtext}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 bg-ink px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp"
              >
                Shop Now
                <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 border border-ink px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] transition hover:bg-ink hover:text-paper"
              >
                View Gallery
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 border-t border-ink/15 pt-6">
              {content.stats.map(({ key, label }) => (
                <div key={key}>
                  <div className="font-display text-3xl font-bold">{key}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-6 reveal-up">
            <div className="relative">
              <div className="absolute -left-4 -top-4 z-10 bg-stamp px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-paper">
                Lookbook · 26
              </div>
              <img
                src={content.hero_image_url ?? hero}
                alt="Model wearing a tee from Sovereign & Sonata"
                className="aspect-[4/5] w-full object-cover stamp-border"
                width={1080}
                height={1350}
              />
              <div className="absolute -bottom-4 -right-4 bg-paper border border-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.2em]">
                Pressed in JA ✶
              </div>
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="container py-20 md:py-28">
          <div className="mb-12 flex items-end justify-between gap-6">
            <SectionHeader
              eyebrow="The Catalogue"
              title={<>Featured <em className="italic font-normal">pieces.</em></>}
            />
            <Link
              to="/shop"
              className="hidden shrink-0 font-mono text-xs uppercase tracking-[0.2em] underline underline-offset-4 hover:text-stamp md:inline"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {featured.map((p) => (
              <Link to="/shop" key={p.id} className="group block">
                <div className="relative overflow-hidden bg-paper-deep">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="aspect-[4/5] w-full bg-paper-deep" />
                  )}
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-display text-lg font-semibold">{p.name}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="bg-ink text-paper">
        <div className="container py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-paper/60">
                <span className="h-px w-8 bg-paper/40" />
                The Process
              </div>
              <h2 className="font-display text-4xl font-bold leading-[1.05] md:text-6xl">
                Shop, checkout, and <em className="italic text-stamp">receive</em> in three steps.
              </h2>
              <img
                src={content.workshop_image_url ?? workshop}
                alt="Inside the Sovereign & Sonata workshop"
                loading="lazy"
                className="mt-10 aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="space-y-8 md:col-span-7 md:pl-8">
              {steps.map(({ n, icon: Icon, title, body }) => (
                <div key={n} className="flex gap-6 border-b border-paper/15 pb-8 last:border-b-0">
                  <div className="font-display text-5xl font-black text-paper/30 md:text-6xl">{n}</div>
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <Icon size={18} className="text-stamp" />
                      <h3 className="font-display text-2xl font-semibold">{title}</h3>
                    </div>
                    <p className="text-paper/70 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24 md:py-32">
        <div className="relative border border-ink p-10 text-center md:p-20">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-paper px-4 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            ✶ Shop Now ✶
          </div>
          <h2 className="font-display text-4xl font-black leading-[1] md:text-7xl">
            Premium apparel,
            <br />
            <span className="italic">pressed in JA.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Quality pieces pressed sharp in our Kingston studio. Browse the collection and order directly online.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 bg-ink px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp"
          >
            Browse the Shop <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}

export default Home
