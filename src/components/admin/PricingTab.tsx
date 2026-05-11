import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { PricingTier, PricingAddon } from '@/lib/db.types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Pencil, Trash2, Plus, Star } from 'lucide-react'
import { toast } from 'sonner'

const emptyTier = { name: '', price: '', unit: '/ piece', description: '', features: '', featured: false }
const emptyAddon = { name: '', price: '' }

export default function PricingTab() {
  const [tiers, setTiers] = useState<PricingTier[]>([])
  const [addons, setAddons] = useState<PricingAddon[]>([])
  const [tierOpen, setTierOpen] = useState(false)
  const [addonOpen, setAddonOpen] = useState(false)
  const [editingTier, setEditingTier] = useState<PricingTier | null>(null)
  const [editingAddon, setEditingAddon] = useState<PricingAddon | null>(null)
  const [tierForm, setTierForm] = useState(emptyTier)
  const [addonForm, setAddonForm] = useState(emptyAddon)

  const load = async () => {
    const [t, a] = await Promise.all([
      supabase!.from('pricing_tiers').select('*').order('order_index'),
      supabase!.from('pricing_addons').select('*').order('order_index'),
    ])
    setTiers(t.data ?? [])
    setAddons(a.data ?? [])
  }

  useEffect(() => { load() }, [])

  const openAddTier = () => { setEditingTier(null); setTierForm(emptyTier); setTierOpen(true) }
  const openEditTier = (t: PricingTier) => {
    setEditingTier(t)
    setTierForm({ name: t.name, price: t.price, unit: t.unit, description: t.description, features: t.features.join('\n'), featured: t.featured })
    setTierOpen(true)
  }

  const saveTier = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...tierForm, features: tierForm.features.split('\n').map(f => f.trim()).filter(Boolean) }
    if (editingTier) {
      const { error } = await supabase!.from('pricing_tiers').update(payload).eq('id', editingTier.id)
      if (error) { toast.error('Failed to save'); return }
      toast.success('Tier updated')
    } else {
      const next = tiers.length ? Math.max(...tiers.map(t => t.order_index)) + 1 : 1
      const { error } = await supabase!.from('pricing_tiers').insert({ ...payload, order_index: next })
      if (error) { toast.error('Failed to save'); return }
      toast.success('Tier added')
    }
    setTierOpen(false)
    load()
  }

  const deleteTier = async (id: string) => {
    if (!confirm('Delete this pricing tier?')) return
    await supabase!.from('pricing_tiers').delete().eq('id', id)
    toast.success('Deleted')
    load()
  }

  const openAddAddon = () => { setEditingAddon(null); setAddonForm(emptyAddon); setAddonOpen(true) }
  const openEditAddon = (a: PricingAddon) => { setEditingAddon(a); setAddonForm({ name: a.name, price: a.price }); setAddonOpen(true) }

  const saveAddon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingAddon) {
      const { error } = await supabase!.from('pricing_addons').update(addonForm).eq('id', editingAddon.id)
      if (error) { toast.error('Failed to save'); return }
      toast.success('Add-on updated')
    } else {
      const next = addons.length ? Math.max(...addons.map(a => a.order_index)) + 1 : 1
      const { error } = await supabase!.from('pricing_addons').insert({ ...addonForm, order_index: next })
      if (error) { toast.error('Failed to save'); return }
      toast.success('Add-on added')
    }
    setAddonOpen(false)
    load()
  }

  const deleteAddon = async (id: string) => {
    if (!confirm('Delete this add-on?')) return
    await supabase!.from('pricing_addons').delete().eq('id', id)
    toast.success('Deleted')
    load()
  }

  return (
    <div className="space-y-12">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Pricing Tiers</h2>
          <button onClick={openAddTier} className="flex items-center gap-2 bg-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp">
            <Plus size={14} /> Add Tier
          </button>
        </div>
        <div className="overflow-hidden border border-ink/15">
          <table className="w-full text-sm">
            <thead className="bg-paper-deep">
              <tr className="border-b border-ink/15">
                {['Name', 'Price', 'Description', 'Featured', ''].map(h => (
                  <th key={h} className="p-3 text-left font-mono text-[10px] uppercase tracking-[0.2em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tiers.map(t => (
                <tr key={t.id} className="border-b border-ink/10 hover:bg-paper-deep/50">
                  <td className="p-3 font-display font-semibold">{t.name}</td>
                  <td className="p-3 font-mono text-xs">{t.price} <span className="text-muted-foreground">{t.unit}</span></td>
                  <td className="p-3 text-muted-foreground">{t.description}</td>
                  <td className="p-3">{t.featured && <Star size={14} className="fill-ink text-ink" />}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditTier(t)} className="border border-ink/20 p-1.5 transition hover:border-ink"><Pencil size={13} /></button>
                      <button onClick={() => deleteTier(t.id)} className="border border-ink/20 p-1.5 transition hover:border-destructive hover:text-destructive"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Add-ons & Extras</h2>
          <button onClick={openAddAddon} className="flex items-center gap-2 bg-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp">
            <Plus size={14} /> Add Extra
          </button>
        </div>
        <div className="overflow-hidden border border-ink/15">
          <table className="w-full text-sm">
            <thead className="bg-paper-deep">
              <tr className="border-b border-ink/15">
                {['Name', 'Price', ''].map(h => (
                  <th key={h} className="p-3 text-left font-mono text-[10px] uppercase tracking-[0.2em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {addons.map(a => (
                <tr key={a.id} className="border-b border-ink/10 hover:bg-paper-deep/50">
                  <td className="p-3 font-display font-semibold">{a.name}</td>
                  <td className="p-3 font-mono text-xs">{a.price}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditAddon(a)} className="border border-ink/20 p-1.5 transition hover:border-ink"><Pencil size={13} /></button>
                      <button onClick={() => deleteAddon(a.id)} className="border border-ink/20 p-1.5 transition hover:border-destructive hover:text-destructive"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={tierOpen} onOpenChange={setTierOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">{editingTier ? 'Edit Tier' : 'Add Tier'}</DialogTitle></DialogHeader>
          <form onSubmit={saveTier} className="mt-2 space-y-4">
            {([['Name', 'name', true], ['Price (e.g. $1,200)', 'price', true], ['Unit (e.g. / piece)', 'unit', true], ['Description', 'description', false]] as const).map(([label, key, req]) => (
              <div key={key}>
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
                <input required={!!req} value={(tierForm as any)[key]} onChange={e => setTierForm({ ...tierForm, [key]: e.target.value })}
                  className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 text-sm outline-none focus:border-ink" />
              </div>
            ))}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Features (one per line)</label>
              <textarea rows={4} value={tierForm.features} onChange={e => setTierForm({ ...tierForm, features: e.target.value })}
                className="mt-1 w-full border border-ink/30 bg-transparent p-2 text-sm outline-none focus:border-ink" />
            </div>
            <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]">
              <input type="checkbox" checked={tierForm.featured} onChange={e => setTierForm({ ...tierForm, featured: e.target.checked })} />
              Mark as Most Popular
            </label>
            <button type="submit" className="w-full bg-ink py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp">
              {editingTier ? 'Save Changes' : 'Add Tier'}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={addonOpen} onOpenChange={setAddonOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">{editingAddon ? 'Edit Add-on' : 'Add Extra'}</DialogTitle></DialogHeader>
          <form onSubmit={saveAddon} className="mt-2 space-y-4">
            {[['Name', 'name'], ['Price (e.g. $1,800 or +50%)', 'price']].map(([label, key]) => (
              <div key={key}>
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
                <input required value={(addonForm as any)[key]} onChange={e => setAddonForm({ ...addonForm, [key]: e.target.value })}
                  className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 text-sm outline-none focus:border-ink" />
              </div>
            ))}
            <button type="submit" className="w-full bg-ink py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp">
              {editingAddon ? 'Save Changes' : 'Add Extra'}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
