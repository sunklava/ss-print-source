import SectionHeader from "@/components/SectionHeader";
import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

const steps = [
  { n: "01", t: "Pick your blank", d: "Tee, hoodie, mug, hat — choose what you want to print on." },
  { n: "02", t: "Share your design", d: "Upload artwork, send a sketch, or describe the vibe." },
  { n: "03", t: "Approve the mockup", d: "We send a free digital mockup before anything is pressed." },
  { n: "04", t: "Pickup or delivery", d: "Most orders ready in 48–72 hours. Bulk in 5–7 days." },
];

const Custom = () => {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    item: "T-Shirt",
    quantity: "1",
    details: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hi Sovereign & Sonata! I'd like to place a custom order.%0A%0AName: ${form.name}%0AContact: ${form.contact}%0AItem: ${form.item}%0AQty: ${form.quantity}%0ADetails: ${form.details}`;
    window.open(`https://wa.me/18760000000?text=${msg}`, "_blank");
    toast.success("Opening WhatsApp to send your order…");
  };

  return (
    <>
      <section className="container py-16 md:py-24">
        <SectionHeader
          eyebrow="Custom Orders"
          title={<>Press anything. <em className="italic font-normal">Anywhere.</em></>}
          description="Single piece or bulk run — same studio, same quality. Here's how it works."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-4">
          {steps.map(({ n, t, d }) => (
            <div key={n} className="border border-ink/15 bg-paper p-6">
              <div className="font-display text-5xl font-black text-stamp">{n}</div>
              <h3 className="mt-4 font-display text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-24">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="font-display text-3xl font-bold md:text-4xl">
              Tell us what you need.
            </h3>
            <p className="mt-3 text-muted-foreground">
              Fill out the form and we'll continue the conversation on WhatsApp —
              fastest way to share artwork and confirm your quote.
            </p>
            <a
              href="https://wa.me/18760000000"
              className="mt-6 inline-flex items-center gap-2 border border-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] transition hover:bg-ink hover:text-paper"
            >
              <MessageCircle size={14} /> Chat on WhatsApp
            </a>
          </div>

          <form onSubmit={submit} className="space-y-4 border border-ink/20 bg-paper-deep p-6 md:p-8">
            {[
              { label: "Your name", key: "name", type: "text" },
              { label: "Phone or email", key: "contact", type: "text" },
            ].map((f) => (
              <div key={f.key}>
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {f.label}
                </label>
                <input
                  required
                  type={f.type}
                  value={(form as any)[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 outline-none focus:border-ink"
                />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Item
                </label>
                <select
                  value={form.item}
                  onChange={(e) => setForm({ ...form, item: e.target.value })}
                  className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 outline-none focus:border-ink"
                >
                  {["T-Shirt", "Hoodie", "Mug", "Cap", "Other"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 outline-none focus:border-ink"
                />
              </div>
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Design details
              </label>
              <textarea
                rows={4}
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                placeholder="Describe your design, colors, deadline…"
                className="mt-1 w-full border border-ink/30 bg-transparent p-3 outline-none focus:border-ink"
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 bg-ink py-4 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp"
            >
              Send via WhatsApp <Send size={14} />
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Custom;
