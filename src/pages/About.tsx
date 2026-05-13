import SectionHeader from "@/components/SectionHeader";
import workshop from "@/assets/workshop.jpg";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const reasons = [
  "High-quality prints that last",
  "Fast and reliable service",
  "Wide range of premium apparel and accessories",
  "Affordable pricing for both single and bulk orders",
];

const About = () => {
  return (
    <>
      <section className="container py-16 md:py-24">
        <SectionHeader
          eyebrow="About"
          title={<>Bringing ideas <em className="italic font-normal">to life,</em> one press at a time.</>}
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
                Apparel & Print
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-6 text-base leading-relaxed text-foreground/90 md:text-lg">
            <p>
              At <strong>Sovereign & Sonata</strong>, we bring ideas to life through
              high-quality apparel and print. Based in Jamaica, our
              business is built on creativity, precision, and the drive to help
              individuals and brands stand out.
            </p>
            <p>
              We specialize in clothing and printed merchandise — from T-shirts and hoodies
              to mugs, hats, and more. Every product is crafted with attention to detail
              using professional heat press technology in our Kingston studio.
            </p>
            <p>
              Sovereign & Sonata serves a wide range of customers — from individuals
              looking for unique, one-of-a-kind pieces to businesses, schools,
              and event organizers in need of branded apparel and promotional
              items. Single orders or bulk runs, we focus on quality, consistency,
              and fast turnaround.
            </p>

            <div className="my-10 border-l-4 border-stamp bg-paper-deep p-6 md:p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Our Mission
              </div>
              <p className="mt-3 font-display text-xl italic leading-snug md:text-2xl">
                "To provide reliable printing services while helping our
                customers express their identity, promote their brand, and
                create memorable products."
              </p>
            </div>

            <p>
              As we continue to grow, Sovereign & Sonata aims to become a full clothing brand —
              combining original designs with premium materials, all pressed in Jamaica.
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
                <em className="italic text-stamp">Pressed</em> better.
              </h2>
              <p className="mt-6 text-paper/70">
                At Sovereign & Sonata, your ideas don't just stay ideas — we make them real.
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
                      <Check size={18} className="text-stamp" />
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
