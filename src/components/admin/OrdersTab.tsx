import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Order } from '@/lib/db.types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye } from 'lucide-react'
import { toast } from 'sonner'

const STATUS_LABELS: Record<Order['status'], string> = {
  new:         'New',
  in_progress: 'In Progress',
  completed:   'Completed',
  cancelled:   'Cancelled',
}

const STATUS_COLORS: Record<Order['status'], string> = {
  new:         'bg-ink text-paper',
  in_progress: 'border border-ink text-ink',
  completed:   'border border-ink/40 text-muted-foreground',
  cancelled:   'border border-destructive/40 text-destructive',
}

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [viewing, setViewing] = useState<Order | null>(null)

  const load = async () => {
    const { data } = await supabase!.from('orders').select('*').order('created_at', { ascending: false })
    setOrders(data ?? [])
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id: string, status: Order['status']) => {
    const { error } = await supabase!.from('orders').update({ status }).eq('id', id)
    if (error) { toast.error('Failed to update'); return }
    toast.success('Status updated')
    load()
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-JM', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Orders & Enquiries</h2>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{orders.length} total</span>
      </div>

      <div className="overflow-hidden border border-ink/15">
        <table className="w-full text-sm">
          <thead className="bg-paper-deep">
            <tr className="border-b border-ink/15">
              {['Date', 'Name', 'Email', 'Item', 'Qty', 'Status', ''].map(h => (
                <th key={h} className="p-3 text-left font-mono text-[10px] uppercase tracking-[0.2em]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b border-ink/10 hover:bg-paper-deep/50">
                <td className="p-3 font-mono text-xs text-muted-foreground">{fmt(o.created_at)}</td>
                <td className="p-3 font-display font-semibold">{o.name}</td>
                <td className="p-3 font-mono text-xs">{o.email}</td>
                <td className="p-3 font-mono text-xs">{o.product_type}</td>
                <td className="p-3 font-mono text-xs">{o.quantity ?? '—'}</td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={e => updateStatus(o.id, e.target.value as Order['status'])}
                    className={`cursor-pointer bg-transparent px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] ${STATUS_COLORS[o.status]}`}
                  >
                    {(Object.keys(STATUS_LABELS) as Order['status'][]).map(s => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <button onClick={() => setViewing(o)} className="border border-ink/20 p-1.5 transition hover:border-ink">
                    <Eye size={13} />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center font-mono text-xs text-muted-foreground">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Order from {viewing?.name}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="mt-2 space-y-3 text-sm">
              {[
                ['Date', fmt(viewing.created_at)],
                ['Email', viewing.email],
                ['Phone', viewing.phone ?? '—'],
                ['Item', viewing.product_type],
                ['Quantity', viewing.quantity?.toString() ?? '—'],
                ['Status', STATUS_LABELS[viewing.status]],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-4 border-b border-ink/10 pb-3 last:border-0">
                  <span className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
              {viewing.details && (
                <div className="border-t border-ink/10 pt-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Details</span>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{viewing.details}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
