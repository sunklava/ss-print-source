import { useCart } from '@/lib/cart'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'

const fmt = (n: number) => `$${n.toLocaleString()}`

export default function CartDrawer() {
  const { items, removeItem, updateQty, total, count, isOpen, setOpen } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md p-0">
        <SheetHeader className="border-b border-ink/10 px-6 py-5">
          <SheetTitle className="font-display text-xl">
            Cart {count > 0 && <span className="ml-2 font-mono text-sm font-normal text-muted-foreground">({count})</span>}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Your cart is empty</p>
            <button onClick={() => setOpen(false)} className="font-mono text-xs uppercase tracking-[0.2em] underline underline-offset-4 text-ink">
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 border-b border-ink/10 pb-5">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="h-20 w-16 shrink-0 object-cover bg-paper-deep" />
                  ) : (
                    <div className="h-20 w-16 shrink-0 bg-paper-deep" />
                  )}
                  <div className="flex flex-1 flex-col min-w-0">
                    <span className="font-display font-semibold truncate">{item.name}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{item.category}</span>
                    <span className="mt-1 font-mono text-xs">{item.priceDisplay}</span>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="border border-ink/20 p-1 transition hover:border-ink">
                        <Minus size={11} />
                      </button>
                      <span className="font-mono text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="border border-ink/20 p-1 transition hover:border-ink">
                        <Plus size={11} />
                      </button>
                      <button onClick={() => removeItem(item.id)}
                        className="ml-auto border border-ink/20 p-1 transition hover:border-destructive hover:text-destructive">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-ink/15 px-6 py-5 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.2em]">Total</span>
                <div className="text-right">
                  <span className="font-display text-2xl font-bold">{fmt(total)}</span>
                  <span className="ml-1 font-mono text-[10px] text-muted-foreground">JMD</span>
                </div>
              </div>
              <Link
                to="/checkout"
                onClick={() => setOpen(false)}
                className="block w-full bg-ink py-3.5 text-center font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
