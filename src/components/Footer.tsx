import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-ink/15 bg-paper-deep">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center bg-ink text-paper font-display text-2xl font-black">
                S
              </span>
              <span className="font-display text-2xl font-bold">SS Print</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Custom printing & apparel out of Jamaica. Pressed with precision,
              built for the bold.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://wa.me/18760000000"
                className="grid h-10 w-10 place-items-center border border-ink/20 transition hover:bg-ink hover:text-paper"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="https://instagram.com"
                className="grid h-10 w-10 place-items-center border border-ink/20 transition hover:bg-ink hover:text-paper"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="mailto:hello@ssprint.jm"
                className="grid h-10 w-10 place-items-center border border-ink/20 transition hover:bg-ink hover:text-paper"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.2em]">
              Navigate
            </h4>
            <ul className="space-y-2 text-sm">
              {["Shop", "Custom", "Pricing", "Gallery", "About", "Contact"].map(
                (l) => (
                  <li key={l}>
                    <Link
                      to={`/${l.toLowerCase()}`}
                      className="text-muted-foreground transition hover:text-ink"
                    >
                      {l}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.2em]">
              Reach Us
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone size={14} /> +1 (876) 000-0000
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} /> hello@ssprint.jm
              </li>
              <li className="pt-2 font-mono text-xs uppercase tracking-[0.18em]">
                Mon–Sat · 9am–7pm
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink/10 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} SS Print — Kingston, JA</span>
          <span>Pressed · Printed · Personal</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
