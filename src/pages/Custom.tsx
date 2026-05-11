import SectionHeader from "@/components/SectionHeader";
import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase, isConfigured } from "@/lib/supabase";

const steps = [
  { n: "01", t: "Pick your blank", d: "Tee, hoodie, sweater, jacket or cap — choose what you want to print on." },
  { n: "02", t: "Share your design", d: "Upload artwork, send a sketch, or describe the vibe." },
  { n: "03", t: "Approve the mockup", d: "We send a free digital mockup before anything is pressed." },
  { n: "04", t: "Pickup or delivery", d: "Most orders ready in 48–72 hours. Bulk in 5–7 days." },
];

const Custom = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    item: "Shirt",
    quantity: "1",
    details: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isConfigured) {
      const { error } = await supabase!.from('orders').insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        product_type: form.item,
        quantity: parseInt(form.quantity) || null,
        details: form.details || null,
        status: 'new',
      });
      if (error) {
        toast.error('Failed to submit order. Please try WhatsApp.');
        setSubmitting(false);
        return;
      }
    }

    const msg = `Hi! I'd like to place a custom order.%0A%0AName: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0AItem: ${form.item}%0AQty: ${form.quantity}%0ADetails: ${form.details}`;
    window.open(`https://wa.me/18760000000?text=${msg}`, "_blank");
    toast.success("Order submitted! Opening WhatsApp to continue…");
    setForm({ name: "", email: "", phone: "", item: "Shirt", quantity: "1", details: "" });
    setSubmitting(false);
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
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Your name</label>
              <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 outline-none focus:border-ink" />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Email address</label>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 outline-none focus:border-ink" />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Phone (optional)</label>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 outline-none focus:border-ink" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Item</label>
                <select value={form.item} onChange={e => setForm({ ...form, item: e.target.value })}
                  className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 outline-none focus:border-ink">
                  {["Shirt", "Hoodie", "Sweater", "Jacket", "Cap", "Other"].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Quantity</label>
                <input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
                  className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 outline-none focus:border-ink" />
              </div>
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Design details</label>
              <textarea rows={4} value={form.details} onChange={e => setForm({ ...form, details: e.target.value })}
                placeholder="Describe your design, colors, deadline…"
                className="mt-1 w-full border border-ink/30 bg-transparent p-3 outline-none focus:border-ink" />
            </div>
            <button type="submit" disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 bg-ink py-4 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp disabled:opacity-50">
              {submitting ? 'Submitting…' : <><Send size={14} /> Send Order</>}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Custom;
