import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/db.types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'

const CATEGORIES = ['Shirts', 'Hoodies', 'Sweaters', 'Jackets', 'Caps']
const empty = { name: '', category: 'Shirts', price: '', image_url: '', tag: '', active: true }

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(empty)

  const load = async () => {
    const { data } = await supabase!.from('products').select('*').order('order_index')
    setProducts(data ?? [])
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(empty); setOpen(true) }
  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({ name: p.name, category: p.category, price: p.price, image_url: p.image_url ?? '', tag: p.tag ?? '', active: p.active })
    setOpen(true)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...form, image_url: form.image_url || null, tag: form.tag || null }
    if (editing) {
      const { error } = await supabase!.from('products').update(payload).eq('id', editing.id)
      if (error) { toast.error('Failed to update product'); return }
      toast.success('Product updated')
    } else {
      const next = products.length ? Math.max(...products.map(p => p.order_index)) + 1 : 1
      const { error } = await supabase!.from('products').insert({ ...payload, order_index: next })
      if (error) { toast.error('Failed to add product'); return }
      toast.success('Product added')
    }
    setOpen(false)
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await supabase!.from('products').delete().eq('id', id)
    toast.success('Product deleted')
    load()
  }

  const toggleActive = async (p: Product) => {
    await supabase!.from('products').update({ active: !p.active }).eq('id', p.id)
    load()
  }

  const field = (label: string, key: keyof typeof empty, required = false) => (
    <div key={key}>
      <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <input
        required={required}
        value={form[key] as string}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 text-sm outline-none focus:border-ink"
      />
    </div>
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Products</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp">
          <Plus size={14} /> Add Product
        </button>
      </div>

      <div className="overflow-hidden border border-ink/15">
        <table className="w-full text-sm">
          <thead className="bg-paper-deep">
            <tr className="border-b border-ink/15">
              {['Name', 'Category', 'Price', 'Tag', 'Status', ''].map(h => (
                <th key={h} className="p-3 text-left font-mono text-[10px] uppercase tracking-[0.2em]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-ink/10 hover:bg-paper-deep/50">
                <td className="p-3 font-display font-semibold">{p.name}</td>
                <td className="p-3 font-mono text-xs">{p.category}</td>
                <td className="p-3 font-mono text-xs">{p.price}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{p.tag ?? '—'}</td>
                <td className="p-3">
                  <button
                    onClick={() => toggleActive(p)}
                    className={`px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition ${p.active ? 'bg-ink text-paper' : 'border border-ink/30 text-muted-foreground hover:border-ink'}`}
                  >
                    {p.active ? 'Live' : 'Hidden'}
                  </button>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(p)} className="border border-ink/20 p-1.5 transition hover:border-ink"><Pencil size={13} /></button>
                    <button onClick={() => remove(p.id)} className="border border-ink/20 p-1.5 transition hover:border-destructive hover:text-destructive"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground font-mono text-xs">No products yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="mt-2 space-y-4">
            {field('Name', 'name', true)}
            {field('Price (e.g. $1,500)', 'price', true)}
            {field('Image URL (optional)', 'image_url')}
            {field('Tag (e.g. Bestseller)', 'tag')}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 text-sm outline-none focus:border-ink"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full bg-ink py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp">
              {editing ? 'Save Changes' : 'Add Product'}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
