import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/db.types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Pencil, Trash2, Plus, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

const CATEGORIES = ['Shirts', 'Hoodies', 'Sweaters', 'Jackets', 'Caps']
const empty = { name: '', category: 'Shirts', price: '', image_url: '', image_position: '50% 50%', tag: '', active: true, featured: false }

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(empty)
  const [uploading, setUploading] = useState(false)
  const imgRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const { data } = await supabase!.from('products').select('*').order('order_index')
    setProducts(data ?? [])
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(empty); setOpen(true) }
  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      image_url: p.image_url ?? '',
      image_position: p.image_position ?? '50% 50%',
      tag: p.tag ?? '',
      active: p.active,
      featured: p.featured,
    })
    setOpen(true)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...form,
      image_url: form.image_url || null,
      image_position: form.image_position || '50% 50%',
      tag: form.tag || null,
    }
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

  const toggleFeatured = async (p: Product) => {
    await supabase!.from('products').update({ featured: !p.featured }).eq('id', p.id)
    load()
  }

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase!.storage.from('products').upload(path, file)
    if (error) { toast.error('Upload failed: ' + error.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase!.storage.from('products').getPublicUrl(path)
    setForm(f => ({ ...f, image_url: publicUrl, image_position: '50% 50%' }))
    setUploading(false)
    if (imgRef.current) imgRef.current.value = ''
  }

  const handleFocalPoint = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    setForm(f => ({ ...f, image_position: `${x}% ${y}%` }))
  }

  const field = (label: string, key: 'name' | 'price' | 'tag', required = false) => (
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

  const [dotX, dotY] = (form.image_position || '50% 50%').split(' ')

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
              {['Name', 'Category', 'Price', 'Tag', 'Featured', 'Status', ''].map(h => (
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
                    onClick={() => toggleFeatured(p)}
                    className={`px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition ${p.featured ? 'bg-stamp text-paper' : 'border border-ink/30 text-muted-foreground hover:border-ink'}`}
                  >
                    {p.featured ? 'Yes' : 'No'}
                  </button>
                </td>
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
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground font-mono text-xs">No products yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="mt-2 space-y-4">
            {field('Name', 'name', true)}
            {field('Price (e.g. $1,500)', 'price', true)}

            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Product Image</label>
              <input ref={imgRef} type="file" accept="image/*" onChange={uploadImage} className="hidden" />

              {form.image_url ? (
                <div className="mt-2 space-y-3">
                  {/* Focal point picker */}
                  <div
                    className="relative aspect-[4/5] w-full cursor-crosshair overflow-hidden border border-ink/20 select-none"
                    onClick={handleFocalPoint}
                    title="Click to set crop focus"
                  >
                    <img
                      src={form.image_url}
                      alt=""
                      className="h-full w-full object-cover pointer-events-none"
                      style={{ objectPosition: form.image_position ?? '50% 50%' }}
                      draggable={false}
                    />
                    {/* Focal point dot */}
                    <div
                      className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)] bg-white/30"
                      style={{ left: dotX, top: dotY }}
                    />
                    <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 bg-ink/70 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-paper">
                      Click to reposition
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button type="button" onClick={() => imgRef.current?.click()} disabled={uploading}
                      className="flex flex-1 items-center justify-center gap-1.5 border border-ink/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition hover:border-ink disabled:opacity-50">
                      <Upload size={11} /> {uploading ? 'Uploading…' : 'Replace'}
                    </button>
                    <button type="button" onClick={() => setForm(f => ({ ...f, image_url: '', image_position: '50% 50%' }))}
                      className="border border-ink/30 p-1.5 transition hover:border-destructive hover:text-destructive">
                      <X size={11} />
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => imgRef.current?.click()} disabled={uploading}
                  className="mt-2 flex w-full items-center justify-center gap-2 border border-dashed border-ink/20 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition hover:border-ink hover:text-ink disabled:opacity-50">
                  <Upload size={13} /> {uploading ? 'Uploading…' : 'Upload Image'}
                </button>
              )}
            </div>

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
            <div className="flex items-center justify-between border border-ink/15 p-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Feature on homepage</span>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                className={`px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition ${form.featured ? 'bg-stamp text-paper' : 'border border-ink/30 text-muted-foreground hover:border-ink'}`}
              >
                {form.featured ? 'Yes' : 'No'}
              </button>
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
