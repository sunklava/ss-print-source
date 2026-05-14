import { useState, useEffect } from "react";
import logo from "../assets/logo_transparent_background.png";
import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MessageCircle } from "lucide-react";
import { supabase, isConfigured } from "@/lib/supabase";

const defaults = {
  contact_phone: '+1 (876) 000-0000',
  contact_email: 'hello@ssprint.jm',
  contact_hours: 'Mon–Sat · 9am–7pm',
  footer_tagline: 'Apparel & print out of Jamaica. Pressed with precision, built for the bold.',
}

const Footer = () => {
  const [info, setInfo] = useState(defaults)

  useEffect(() => {
    if (!isConfigured) return
    supabase!
      .from('site_content')
      .select('contact_phone, contact_email, contact_hours, footer_tagline')
      .eq('id', 1)
      .single()
      .then(({ data }) => { if (data) setInfo(prev => ({ ...prev, ...data })) })
  }, [])

  const whatsappHref = `https://wa.me/${info.contact_phone.replace(/\D/g, '')}`
  const emailHref = `mailto:${info.contact_email}`

  return (
    <footer className="mt-24 border-t border-ink/15 bg-paper-deep">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Sovereign & Sonata Logo" className="h-10 w-10 object-contain" />
              <span className="font-display text-2xl font-bold">Sovereign & Sonata</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              {info.footer_tagline}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={whatsappHref}
                className="grid h-10 w-10 place-items-center border border-ink/20 transition hover:bg-ink hover:text-paper"
                aria-label={`WhatsApp: ${info.contact_phone}`}
              >
                <MessageCircle size={16} aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com"
                className="grid h-10 w-10 place-items-center border border-ink/20 transition hover:bg-ink hover:text-paper"
                aria-label="Instagram"
              >
                <Instagram size={16} aria-hidden="true" />
              </a>
              <a
                href={emailHref}
                className="grid h-10 w-10 place-items-center border border-ink/20 transition hover:bg-ink hover:text-paper"
                aria-label={`Email: ${info.contact_email}`}
              >
                <Mail size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em]">
              Navigate
            </h2>
            <ul className="space-y-2 text-sm">
              {["Shop", "Gallery", "About", "Contact"].map((l) => (
                <li key={l}>
                  <Link
                    to={`/${l.toLowerCase()}`}
                    className="text-muted-foreground transition hover:text-ink"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em]">
              Reach Us
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone size={14} aria-hidden="true" />
                <a href={`tel:+${info.contact_phone.replace(/\D/g, '')}`} className="hover:text-ink transition">
                  {info.contact_phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} aria-hidden="true" />
                <a href={emailHref} className="hover:text-ink transition">
                  {info.contact_email}
                </a>
              </li>
              <li className="pt-2 font-mono text-xs uppercase tracking-[0.18em]">
                {info.contact_hours}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink/10 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} Sovereign & Sonata — Kingston, JA</span>
          <span>Pressed · Printed · Personal</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
