import { useState, useEffect } from 'react'
import SectionHeader from "@/components/SectionHeader"
import { MessageCircle, Phone, Mail, Clock, MapPin, AtSign } from "lucide-react"
import { supabase, isConfigured } from '@/lib/supabase'
import type { SiteContent } from '@/lib/db.types'

const defaults = {
  contact_phone: '+1 (876) 000-0000',
  contact_email: 'hello@ssprint.jm',
  contact_hours: 'Mon–Sat · 9am–7pm',
}

const Contact = () => {
  const [info, setInfo] = useState(defaults)

  useEffect(() => {
    if (!isConfigured) return
    supabase!.from('site_content').select('contact_phone, contact_email, contact_hours').eq('id', 1).single()
      .then(({ data }) => { if (data) setInfo(data as Pick<SiteContent, 'contact_phone' | 'contact_email' | 'contact_hours'>) })
  }, [])

  const items = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: info.contact_phone,
      href: `https://wa.me/${info.contact_phone.replace(/\D/g, '')}`,
      cta: "Chat now",
    },
    {
      icon: Phone,
      label: "Phone",
      value: info.contact_phone,
      href: `tel:+${info.contact_phone.replace(/\D/g, '')}`,
      cta: "Call us",
    },
    {
      icon: Mail,
      label: "Email",
      value: info.contact_email,
      href: `mailto:${info.contact_email}`,
      cta: "Send email",
    },
    {
      icon: AtSign,
      label: "Instagram",
      value: "@ssprint.jm",
      href: "https://instagram.com",
      cta: "Follow",
    },
  ]

  return (
    <>
      <section className="container py-16 md:py-24">
        <SectionHeader
          eyebrow="Contact"
          title={<>Let's <em className="italic font-normal">talk shop.</em></>}
          description="The fastest way to reach us is on WhatsApp. We respond during business hours, every day except Sunday."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {items.map(({ icon: Icon, label, value, href, cta }) => (
            <a
              key={label}
              href={href}
              aria-label={`${label}: ${value} — ${cta}`}
              className="group flex items-center justify-between border border-ink/20 bg-paper p-6 transition hover:border-ink hover:bg-ink hover:text-paper md:p-8"
            >
              <div className="flex items-center gap-5" aria-hidden="true">
                <div className="grid h-12 w-12 place-items-center border border-current">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-70">
                    {label}
                  </div>
                  <div className="font-display text-xl font-semibold">
                    {value}
                  </div>
                </div>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70 transition group-hover:translate-x-1" aria-hidden="true">
                {cta} →
              </span>
            </a>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="border border-ink/20 bg-paper-deep p-6 md:p-8">
            <div className="flex items-center gap-3 text-stamp">
              <Clock size={18} aria-hidden="true" />
              <h3 className="font-display text-xl font-bold">Hours</h3>
            </div>
            <p className="mt-4 font-mono text-sm">{info.contact_hours}</p>
          </div>

          <div className="border border-ink/20 bg-paper-deep p-6 md:p-8">
            <div className="flex items-center gap-3 text-stamp">
              <MapPin size={18} aria-hidden="true" />
              <h3 className="font-display text-xl font-bold">Location</h3>
            </div>
            <p className="mt-4 leading-relaxed">
              Based in Kingston, Jamaica.
              <br />
              Pickup and island-wide delivery available.
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Studio visits by appointment only.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact
