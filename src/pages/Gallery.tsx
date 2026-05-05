import SectionHeader from "@/components/SectionHeader";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import workshop from "@/assets/workshop.jpg";
import hero from "@/assets/hero-apparel.jpg";
import tshirt from "@/assets/product-tshirt.jpg";
import hoodie from "@/assets/product-hoodie.jpg";
import mug from "@/assets/product-mug.jpg";

const items = [
  { src: hero, label: "Lookbook · 26", span: "md:col-span-2 md:row-span-2" },
  { src: g1, label: "Crew Order" },
  { src: g2, label: "Volume Run" },
  { src: workshop, label: "The Press", span: "md:col-span-2" },
  { src: g3, label: "Detail · Macro" },
  { src: tshirt, label: "Custom Tee" },
  { src: hoodie, label: "Heavy Hoodie" },
  { src: mug, label: "Branded Mug" },
];

const Gallery = () => {
  return (
    <section className="container py-16 md:py-24">
      <SectionHeader
        eyebrow="Gallery"
        title={<>The <em className="italic font-normal">work.</em></>}
        description="A sample of pieces pressed in the studio. Every job, every size, every print."
      />

      <div className="mt-12 grid auto-rows-[240px] grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {items.map((it, i) => (
          <div
            key={i}
            className={`group relative overflow-hidden bg-paper-deep ${it.span ?? ""}`}
          >
            <img
              src={it.src}
              alt={it.label}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/30" />
            <div className="absolute left-3 top-3 bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">
              {it.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
