import SectionHeader from "@/components/SectionHeader";
import tshirt from "@/assets/product-tshirt.jpg";
import hoodie from "@/assets/product-hoodie.jpg";
import cap from "@/assets/product-cap.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import { Link } from "react-router-dom";
import { useState } from "react";

const products = [
  { name: "Classic Tee", category: "Apparel", price: "$1,500", img: tshirt, tag: "Bestseller" },
  { name: "Heavy Hoodie", category: "Apparel", price: "$4,800", img: hoodie, tag: "New" },
  { name: "Dad Cap", category: "Headwear", price: "$1,800", img: cap },
  { name: "Statement Tee", category: "Apparel", price: "$1,800", img: gallery2 },
  { name: "Crew Neck", category: "Apparel", price: "$3,400", img: hoodie },
  { name: "Snapback", category: "Headwear", price: "$2,000", img: cap },
];

const cats = ["All", "Apparel", "Headwear"];

const Shop = () => {
  const [active, setActive] = useState("All");
  const list = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <>
      <section className="container py-16 md:py-24">
        <SectionHeader
          eyebrow="Shop the Press"
          title={<>The <em className="italic font-normal">collection.</em></>}
          description="Curated essentials, ready to be customized or worn as-is. Every piece pressed in our Kingston studio."
        />

        <div className="mt-10 flex flex-wrap gap-2 border-b border-ink/15 pb-6">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] transition ${
                active === c
                  ? "bg-ink text-paper"
                  : "border border-ink/20 hover:border-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
          {list.map((p, i) => (
            <div key={p.name + i} className="group">
              <div className="relative overflow-hidden bg-paper-deep">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
                />
                {p.tag && (
                  <span className="absolute left-3 top-3 bg-ink px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-paper">
                    {p.tag}
                  </span>
                )}
                <Link
                  to="/custom"
                  className="absolute inset-x-3 bottom-3 translate-y-2 bg-paper py-3 text-center font-mono text-[11px] uppercase tracking-[0.2em] opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100"
                >
                  Order →
                </Link>
              </div>
              <div className="mt-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {p.category}
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-display text-lg font-semibold">{p.name}</span>
                  <span className="font-mono text-xs">{p.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Shop;
