import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { useCart } from '@/lib/cart'
import { supabase, isConfigured } from '@/lib/supabase'
import { toast } from 'sonner'
import { ArrowLeft, Package, Truck } from 'lucide-react'

const fmt = (n: number) => `$${n.toLocaleString('en-US')}`

const COUNTRIES = [
  { code: 'US', name: 'United States', stateLabel: 'State', postalLabel: 'ZIP Code', postalPlaceholder: '10001', statePlaceholder: 'e.g. New York' },
  { code: 'CA', name: 'Canada',        stateLabel: 'Province', postalLabel: 'Postal Code', postalPlaceholder: 'A1A 1A1', statePlaceholder: 'e.g. Ontario' },
  { code: 'JM', name: 'Jamaica',       stateLabel: 'Parish', postalLabel: 'Postal Code', postalPlaceholder: 'JMAKN05', statePlaceholder: 'e.g. Kingston' },
]

const paypalOptions = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID ?? 'test',
  currency: 'USD',
}

const inputClass = 'mt-1 w-full border-b border-ink/30 bg-transparent py-2 text-sm outline-none focus:border-ink'
const labelClass = 'font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground'

function CheckoutInner() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [{ isPending }] = usePayPalScriptReducer()
  const [step, setStep] = useState<'details' | 'payment'>('details')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [addressCity, setAddressCity] = useState('')
  const [addressState, setAddressState] = useState('')
  const [addressZip, setAddressZip] = useState('')
  const [addressCountry, setAddressCountry] = useState('US')

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
        delivery_method: deliveryMethod,
        address_line1: deliveryMethod === 'delivery' ? addressLine1 : null,
        address_city: deliveryMethod === 'delivery' ? (addressLine2 ? `${addressLine2}, ${addressCity}` : addressCity) || null : null,
        address_parish: deliveryMethod === 'delivery' ? addressState : null,
        address_postal: deliveryMethod === 'delivery' ? addressZip || null : null,
        address_country: deliveryMethod === 'delivery' ? countryName : null,
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
    toast.success("Order confirmed! We'll be in touch shortly.")
    navigate('/')
  }

  const countryName = COUNTRIES.find(c => c.code === addressCountry)?.name ?? addressCountry
  const formattedAddress = deliveryMethod === 'delivery'
    ? [addressLine1, addressLine2, addressCity, addressState, addressZip, countryName].filter(Boolean).join(', ')
    : 'Studio Pickup'

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
                  <div className="h-16 w-12 shrink-0 bg-paper-deep" aria-hidden="true" />
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
              <form onSubmit={e => { e.preventDefault(); setStep('payment') }} className="space-y-6" aria-label="Your details">

                {/* Contact info */}
                <div className="space-y-5">
                  <div>
                    <label htmlFor="checkout-name" className={labelClass}>
                      Full Name <span aria-hidden="true">*</span><span className="sr-only">(required)</span>
                    </label>
                    <input id="checkout-name" required aria-required="true" value={name} onChange={e => setName(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="checkout-email" className={labelClass}>
                      Email <span aria-hidden="true">*</span><span className="sr-only">(required)</span>
                    </label>
                    <input id="checkout-email" required aria-required="true" type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="checkout-phone" className={labelClass}>
                      Phone <span aria-hidden="true">*</span><span className="sr-only">(required)</span>
                    </label>
                    <input id="checkout-phone" required aria-required="true" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 876 000 0000" className={inputClass} />
                  </div>
                </div>

                {/* Delivery method */}
                <div>
                  <p className={labelClass + ' mb-3'}>
                    Fulfillment <span aria-hidden="true">*</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3" role="group" aria-label="Choose fulfillment method">
                    {([
                      { value: 'delivery', icon: Truck,   title: 'Ship to me',  desc: 'Delivered to your door' },
                      { value: 'pickup',   icon: Package, title: 'Studio Pickup', desc: 'Collect from Kingston, JA' },
                    ] as const).map(({ value, icon: Icon, title, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setDeliveryMethod(value)}
                        aria-pressed={deliveryMethod === value}
                        className={`flex flex-col items-start gap-2 border p-4 text-left transition ${
                          deliveryMethod === value
                            ? 'border-ink bg-ink text-paper'
                            : 'border-ink/20 hover:border-ink'
                        }`}
                      >
                        <Icon size={16} aria-hidden="true" />
                        <div>
                          <div className="font-mono text-xs uppercase tracking-[0.2em]">{title}</div>
                          <div className={`font-mono text-[10px] mt-0.5 ${deliveryMethod === value ? 'text-paper/70' : 'text-muted-foreground'}`}>
                            {desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shipping address — international */}
                {deliveryMethod === 'delivery' && (() => {
                  const country = COUNTRIES.find(c => c.code === addressCountry) ?? COUNTRIES[0]
                  return (
                    <div className="space-y-5 border-t border-ink/10 pt-6">
                      <h3 className="font-display text-base font-semibold">Shipping Address</h3>
                      <div>
                        <label htmlFor="checkout-country" className={labelClass}>
                          Country <span aria-hidden="true">*</span><span className="sr-only">(required)</span>
                        </label>
                        <select id="checkout-country" required aria-required="true" value={addressCountry} onChange={e => { setAddressCountry(e.target.value); setAddressState(''); setAddressZip('') }}
                          className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 text-sm outline-none focus:border-ink">
                          {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="checkout-address1" className={labelClass}>
                          Street Address <span aria-hidden="true">*</span><span className="sr-only">(required)</span>
                        </label>
                        <input id="checkout-address1" required aria-required="true" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} placeholder="123 Main St" className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="checkout-address2" className={labelClass}>Apt, Suite, Unit (optional)</label>
                        <input id="checkout-address2" value={addressLine2} onChange={e => setAddressLine2(e.target.value)} placeholder="Apt 4B" className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="checkout-city" className={labelClass}>
                          City <span aria-hidden="true">*</span><span className="sr-only">(required)</span>
                        </label>
                        <input id="checkout-city" required aria-required="true" value={addressCity} onChange={e => setAddressCity(e.target.value)} className={inputClass} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="checkout-state" className={labelClass}>
                            {country.stateLabel} <span aria-hidden="true">*</span><span className="sr-only">(required)</span>
                          </label>
                          <input id="checkout-state" required aria-required="true" value={addressState} onChange={e => setAddressState(e.target.value)} placeholder={country.statePlaceholder} className={inputClass} />
                        </div>
                        <div>
                          <label htmlFor="checkout-zip" className={labelClass}>
                            {country.postalLabel} <span aria-hidden="true">*</span><span className="sr-only">(required)</span>
                          </label>
                          <input id="checkout-zip" required aria-required="true" value={addressZip} onChange={e => setAddressZip(e.target.value)} placeholder={country.postalPlaceholder} className={inputClass} />
                        </div>
                      </div>
                    </div>
                  )
                })()}

                <button type="submit" className="w-full bg-ink py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp">
                  Continue to Payment
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="font-display text-xl font-bold mb-6 pb-2 border-b border-ink/15">Payment</h2>

              <div className="mb-6 border border-ink/15 p-4 space-y-2 text-sm">
                {([
                  ['Name', name],
                  ['Email', email],
                  ['Phone', phone],
                  ['Fulfillment', deliveryMethod === 'pickup' ? 'Studio Pickup' : 'Ship to me'],
                  ...(deliveryMethod === 'delivery' ? [['Ship to', formattedAddress]] : []),
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground shrink-0">{label}</span>
                    <span className="text-right text-sm">{value}</span>
                  </div>
                ))}
                <button onClick={() => setStep('details')}
                  className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-2 transition hover:text-ink">
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
                        amount: { currency_code: 'USD', value: total.toFixed(2) },
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
