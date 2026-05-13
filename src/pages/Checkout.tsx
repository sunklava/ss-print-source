import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { useCart } from '@/lib/cart'
import { supabase, isConfigured } from '@/lib/supabase'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

const fmt = (n: number) => `$${n.toLocaleString()}`

const paypalOptions = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID ?? 'test',
  currency: 'USD',
}

function CheckoutInner() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [{ isPending }] = usePayPalScriptReducer()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<'details' | 'payment'>('details')

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Your cart is empty</p>
        <button onClick={() => navigate('/shop')} className="font-mono text-xs uppercase tracking-[0.2em] underline underline-offset-4">
          Back to shop
        </button>
      </div>
    )
  }

  const handleApprove = async (paypalOrderId: string) => {
    if (isConfigured) {
      await supabase!.from('orders').insert({
        name,
        email,
        phone: phone || null,
        product_type: items.map(i => i.name).join(', '),
        quantity: items.reduce((s, i) => s + i.quantity, 0),
        details: items.map(i => `${i.name} x${i.quantity} @ ${i.priceDisplay}`).join('\n'),
        status: 'new',
        payment_status: 'paid',
        payment_id: paypalOrderId,
        total_amount: total,
        items,
      })
    }
    clearCart()
    toast.success('Order confirmed! We\'ll be in touch shortly.')
    navigate('/')
  }

  return (
    <section className="container py-16 md:py-24">
      <button onClick={() => navigate('/shop')} aria-label="Go back to shop" className="mb-10 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:text-ink">
        <ArrowLeft size={13} aria-hidden="true" /> Back to shop
      </button>

      <h1 className="font-display text-4xl font-black md:text-5xl mb-12">Checkout</h1>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Order summary */}
        <div>
          <h2 className="font-display text-xl font-bold mb-6 pb-2 border-b border-ink/15">Order Summary</h2>
          <div className="space-y-5">
            {items.map(item => (
              <div key={item.id} className="flex gap-4">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="h-16 w-12 shrink-0 object-cover bg-paper-deep" />
                ) : (
                  <div className="h-16 w-12 shrink-0 bg-paper-deep" />
                )}
                <div className="flex flex-1 items-start justify-between gap-2">
                  <div>
                    <div className="font-display font-semibold">{item.name}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{item.category}</div>
                    <div className="font-mono text-xs mt-0.5">Qty: {item.quantity}</div>
                  </div>
                  <span className="font-mono text-sm shrink-0">{fmt(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-baseline justify-between border-t border-ink/15 pt-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em]">Total</span>
            <div>
              <span className="font-display text-3xl font-black">{fmt(total)}</span>
              <span className="ml-1 font-mono text-xs text-muted-foreground">USD</span>
            </div>
          </div>
        </div>

        {/* Details + payment */}
        <div>
          {step === 'details' ? (
            <>
              <h2 className="font-display text-xl font-bold mb-6 pb-2 border-b border-ink/15">Your Details</h2>
              <form onSubmit={e => { e.preventDefault(); setStep('payment') }} className="space-y-5" aria-label="Your details">
                <div>
                  <label htmlFor="checkout-name" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Full Name <span aria-hidden="true">*</span><span className="sr-only">(required)</span>
                  </label>
                  <input id="checkout-name" required aria-required="true" value={name} onChange={e => setName(e.target.value)}
                    className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 text-sm outline-none focus:border-ink" />
                </div>
                <div>
                  <label htmlFor="checkout-email" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Email <span aria-hidden="true">*</span><span className="sr-only">(required)</span>
                  </label>
                  <input id="checkout-email" required aria-required="true" type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 text-sm outline-none focus:border-ink" />
                </div>
                <div>
                  <label htmlFor="checkout-phone" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Phone (optional)</label>
                  <input id="checkout-phone" value={phone} onChange={e => setPhone(e.target.value)}
                    className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 text-sm outline-none focus:border-ink" />
                </div>
                <button type="submit"
                  className="w-full bg-ink py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp">
                  Continue to Payment
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="font-display text-xl font-bold mb-6 pb-2 border-b border-ink/15">Payment</h2>
              <div className="mb-6 border border-ink/15 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Name</span>
                  <span>{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Email</span>
                  <span>{email}</span>
                </div>
                <button onClick={() => setStep('details')}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-2 transition hover:text-ink">
                  Edit details
                </button>
              </div>

              {isPending ? (
                <div className="py-10 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Loading payment…
                </div>
              ) : (
                <PayPalButtons
                  style={{ layout: 'vertical', label: 'pay', shape: 'rect', color: 'black' }}
                  createOrder={(_data, actions) =>
                    actions.order.create({
                      intent: 'CAPTURE',
                      purchase_units: [{
                        amount: {
                          currency_code: 'USD',
                          value: total.toFixed(2),
                        },
                        description: items.map(i => `${i.name} x${i.quantity}`).join(', '),
                      }],
                    })
                  }
                  onApprove={(_data, actions) =>
                    actions.order!.capture().then(details => handleApprove(details.id ?? ''))
                  }
                  onError={() => toast.error('Payment failed. Please try again.')}
                />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default function Checkout() {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      <CheckoutInner />
    </PayPalScriptProvider>
  )
}
