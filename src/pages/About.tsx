import SectionHeader from "@/components/SectionHeader";
import workshop from "@/assets/workshop.jpg";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const reasons = [
  "High-quality apparel that lasts",
  "Fast and reliable island-wide delivery",
  "Wide range of premium apparel and accessories",
  "Affordable pricing on every order",
];

const About = () => {
  return (
    <>
      <section className="container py-16 md:py-24">
        <SectionHeader
          eyebrow="About"
          title={<>Premium apparel, <em className="italic font-normal">built for you.</em></>}
          level={1}
        />

        <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <img
              src={workshop}
              alt="Sovereign & Sonata workshop"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover stamp-border"
            />
            <div className="mt-6 border border-ink/20 bg-paper-deep p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Based in
              </div>
              <div className="mt-1 font-display text-2xl font-bold">Jamaica</div>
              <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Specialty
              </div>
              <div className="mt-1 font-display text-2xl font-bold">
                Premium Apparel
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-6 text-base leading-relaxed text-foreground/90 md:text-lg">
            <p>
              At <strong>Sovereign & Sonata</strong>, we curate premium apparel built for
              those who want to stand out. Based in Kingston, Jamaica, our business is
              built on quality, style, and the drive to bring bold fashion to the island.
            </p>
            <p>
              We stock a carefully selected range of clothing — from T-shirts and hoodies
              to hats and accessories. Every piece is chosen for its quality, fit, and
              lasting appeal, so you always look and feel your best.
            </p>
            <p>
              Sovereign & Sonata serves everyone — individuals looking for everyday
              essentials, fashion-forward pieces, and wardrobe staples. We keep
              things simple: great apparel, fair prices, and fast island-wide delivery
              or studio pickup in Kingston.
            </p>

            <div className="my-10 border-l-4 border-stamp bg-paper-deep p-6 md:p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Our Mission
              </div>
              <p className="mt-3 font-display text-xl italic leading-snug md:text-2xl">
                "To make premium apparel accessible to everyone in Jamaica —
                delivering quality, style, and confidence with every order."
              </p>
            </div>

            <p>
              As we grow, Sovereign & Sonata is becoming a destination for premium
              fashion in Jamaica — a place where quality pieces are always within reach.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="container py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-paper/60">
                <span className="h-px w-8 bg-paper/40" aria-hidden="true" />
                Why Choose Sovereign & Sonata
              </div>
              <h2 className="font-display text-4xl font-bold leading-[1.05] md:text-6xl">
                Built different.
                <br />
                <em className="italic text-stamp">Styled</em> better.
              </h2>
              <p className="mt-6 text-paper/70">
                At Sovereign & Sonata, great style shouldn't be hard to find — we bring it to you.
              </p>
              <Link
                to="/shop"
                className="mt-8 inline-block bg-paper px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-ink transition hover:bg-stamp hover:text-paper"
              >
                Shop now <span aria-hidden="true">→</span>
              </Link>
            </div>
            <ul className="space-y-5">
              {reasons.map((r, i) => (
                <li
                  key={r}
                  className="flex items-start gap-5 border-b border-paper/15 pb-5"
                >
                  <span className="font-display text-3xl font-black text-stamp">
                    0{i + 1}
                  </span>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3">
                      <Check size={18} className="text-stamp" aria-hidden="true" />
                      <span className="font-display text-xl font-semibold">
                        {r}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
