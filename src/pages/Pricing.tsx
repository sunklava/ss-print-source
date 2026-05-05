import SectionHeader from "@/components/SectionHeader";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Single Piece",
    price: "$1,500",
    unit: "/ piece",
    desc: "Perfect for personal designs and gifts.",
    features: ["1 print location", "Free digital mockup", "48–72hr turnaround", "Pickup or delivery"],
  },
  {
    name: "Small Run",
    price: "$1,200",
    unit: "/ piece",
    desc: "10–24 pieces. Great for crews and small teams.",
    features: ["Up to 2 print locations", "Free mockup + revisions", "5 day turnaround", "10% deposit"],
    featured: true,
  },
  {
    name: "Bulk Order",
    price: "$950",
    unit: "/ piece",
    desc: "25+ pieces. Schools, events, businesses.",
    features: ["Unlimited locations", "Dedicated production rep", "5–7 day turnaround", "Volume pricing"],
  },
];

const addons = [
  ["Mug Print", "$900"],
  ["Cap Embroidery", "$1,800"],
  ["Hoodie Press", "$4,800"],
  ["Rush 24hr Service", "+50%"],
  ["Extra Print Location", "+$400"],
  ["Design Service", "from $2,500"],
];

const Pricing = () => {
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
            <div
              key={t.name}
              className={`relative flex flex-col border p-8 ${
                t.featured
                  ? "bg-ink text-paper border-ink"
                  : "bg-paper border-ink/20"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-8 bg-stamp px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-paper">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-2xl font-bold">{t.name}</h3>
              <p className={`mt-2 text-sm ${t.featured ? "text-paper/70" : "text-muted-foreground"}`}>
                {t.desc}
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
                to="/custom"
                className={`mt-8 block py-3 text-center font-mono text-xs uppercase tracking-[0.2em] transition ${
                  t.featured
                    ? "bg-paper text-ink hover:bg-stamp hover:text-paper"
                    : "border border-ink hover:bg-ink hover:text-paper"
                }`}
              >
                Get a quote
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-20">
        <h3 className="font-display text-3xl font-bold md:text-4xl">Add-ons & extras</h3>
        <div className="mt-8 grid gap-px bg-ink/15 md:grid-cols-2">
          {addons.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between bg-paper px-6 py-5">
              <span className="font-display text-lg">{k}</span>
              <span className="font-mono text-sm">{v}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
          * Prices in JMD. All custom orders include a free digital mockup before
          production. 50% deposit required for orders over 10 pieces. Final pricing
          confirmed after design review.
        </p>
      </section>
    </>
  );
};

export default Pricing;
