import SectionHeader from "@/components/SectionHeader";
import { MessageCircle, Phone, Mail, Clock, MapPin, Instagram } from "lucide-react";

const Contact = () => {
  const items = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+1 (876) 000-0000",
      href: "https://wa.me/18760000000",
      cta: "Chat now",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (876) 000-0000",
      href: "tel:+18760000000",
      cta: "Call us",
    },
    {
      icon: Mail,
      label: "Email",
      value: "hello@ssprint.jm",
      href: "mailto:hello@ssprint.jm",
      cta: "Send email",
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@ssprint.jm",
      href: "https://instagram.com",
      cta: "Follow",
    },
  ];

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
              className="group flex items-center justify-between border border-ink/20 bg-paper p-6 transition hover:border-ink hover:bg-ink hover:text-paper md:p-8"
            >
              <div className="flex items-center gap-5">
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
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70 transition group-hover:translate-x-1">
                {cta} →
              </span>
            </a>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="border border-ink/20 bg-paper-deep p-6 md:p-8">
            <div className="flex items-center gap-3 text-stamp">
              <Clock size={18} />
              <h3 className="font-display text-xl font-bold">Hours</h3>
            </div>
            <ul className="mt-4 space-y-2 font-mono text-sm">
              <li className="flex justify-between border-b border-ink/10 py-2">
                <span>Monday – Friday</span>
                <span>9:00 AM — 7:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-ink/10 py-2">
                <span>Saturday</span>
                <span>10:00 AM — 5:00 PM</span>
              </li>
              <li className="flex justify-between py-2">
                <span>Sunday</span>
                <span className="text-muted-foreground">Closed</span>
              </li>
            </ul>
          </div>

          <div className="border border-ink/20 bg-paper-deep p-6 md:p-8">
            <div className="flex items-center gap-3 text-stamp">
              <MapPin size={18} />
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
  );
};

export default Contact;
