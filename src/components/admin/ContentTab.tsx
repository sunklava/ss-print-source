import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { SiteContent } from '@/lib/db.types'
import { Plus, Trash2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

const defaults: Omit<SiteContent, 'id'> = {
  hero_eyebrow: 'Vol. 01 — Spring Press',
  hero_heading: 'Wear your ideas.',
  hero_subtext: 'Custom printing & apparel out of Jamaica. From a single tee to a full team kit — we press it sharp, fast, and built to last.',
  hero_image_url: null,
  workshop_image_url: null,
  stats: [
    { key: '500+', label: 'Pieces Pressed' },
    { key: '48h', label: 'Avg. Turnaround' },
    { key: '100%', label: 'Custom' },
  ],
  marquee_items: ['Custom Printing', 'Heat Press', 'Embroidery', 'Screen Print', 'Kingston, JA'],
  contact_phone: '+1 (876) 000-0000',
  contact_email: 'hello@ssprint.jm',
  contact_hours: 'Mon–Sat · 9am–7pm',
  footer_tagline: 'Pressed · Printed · Personal',
}

export default function ContentTab() {
  const [content, setContent] = useState<Omit<SiteContent, 'id'>>(defaults)
  const [saving, setSaving] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingWorkshop, setUploadingWorkshop] = useState(false)
  const heroImgRef = useRef<HTMLInputElement>(null)
  const workshopImgRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase!.from('site_content').select('*').eq('id', 1).single()
      .then(({ data }) => { if (data) setContent(data) })
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase!.from('site_content').upsert({ id: 1, ...content })
    setSaving(false)
    if (error) { toast.error('Failed to save'); return }
    toast.success('Content saved')
  }

  const uploadSiteImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'hero_image_url' | 'workshop_image_url',
    setLoading: (v: boolean) => void,
    ref: React.RefObject<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    const ext = file.name.split('.').pop()
    const path = `${field}-${Date.now()}.${ext}`
    const { error } = await supabase!.storage.from('site').upload(path, file, { upsert: true })
    if (error) { toast.error('Upload failed: ' + error.message); setLoading(false); return }
    const { data: { publicUrl } } = supabase!.storage.from('site').getPublicUrl(path)
    setContent(c => ({ ...c, [field]: publicUrl }))
    setLoading(false)
    if (ref.current) ref.current.value = ''
  }

  const setStat = (i: number, field: 'key' | 'label', value: string) => {
    const stats = [...content.stats]
    stats[i] = { ...stats[i], [field]: value }
    setContent({ ...content, stats })
  }

  const addStat = () => setContent({ ...content, stats: [...content.stats, { key: '', label: '' }] })
  const removeStat = (i: number) => setContent({ ...content, stats: content.stats.filter((_, j) => j !== i) })
  const setMarquee = (value: string) =>
    setContent({ ...content, marquee_items: value.split('\n').map(s => s.trim()).filter(Boolean) })

  const textField = (label: string, key: keyof typeof defaults, rows?: number) => (
    <div key={key}>
      <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      {rows ? (
        <textarea rows={rows} value={content[key] as string} onChange={e => setContent({ ...content, [key]: e.target.value })}
          className="mt-1 w-full border border-ink/30 bg-transparent p-2 text-sm outline-none focus:border-ink" />
      ) : (
        <input value={content[key] as string} onChange={e => setContent({ ...content, [key]: e.target.value })}
          className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 text-sm outline-none focus:border-ink" />
      )}
    </div>
  )

  return (
    <form onSubmit={save} className="max-w-2xl space-y-8">
      <div>
        <h2 className="mb-6 font-display text-2xl font-bold">Hero Section</h2>
        <div className="space-y-4">
          {textField('Eyebrow text', 'hero_eyebrow')}
          {textField('Heading', 'hero_heading')}
          {textField('Subtext', 'hero_subtext', 3)}

          {/* Hero image */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Hero Image</label>
            <input ref={heroImgRef} type="file" accept="image/*" onChange={e => uploadSiteImage(e, 'hero_image_url', setUploadingHero, heroImgRef as React.RefObject<HTMLInputElement>)} className="hidden" />
            {content.hero_image_url ? (
              <div className="mt-2 flex items-center gap-3">
                <img src={content.hero_image_url} alt="" className="h-16 w-24 object-cover border border-ink/20" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => heroImgRef.current?.click()} disabled={uploadingHero}
                    className="flex items-center gap-1.5 border border-ink/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition hover:border-ink disabled:opacity-50">
                    <Upload size={11} /> {uploadingHero ? 'Uploading…' : 'Replace'}
                  </button>
                  <button type="button" onClick={() => setContent(c => ({ ...c, hero_image_url: null }))}
                    className="border border-ink/30 p-1.5 transition hover:border-destructive hover:text-destructive">
                    <X size={11} />
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => heroImgRef.current?.click()} disabled={uploadingHero}
                className="mt-2 flex w-full items-center justify-center gap-2 border border-dashed border-ink/20 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition hover:border-ink hover:text-ink disabled:opacity-50">
                <Upload size={13} /> {uploadingHero ? 'Uploading…' : 'Upload Hero Image'}
              </button>
            )}
          </div>

          {/* Workshop / process image */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Process Section Image</label>
            <input ref={workshopImgRef} type="file" accept="image/*" onChange={e => uploadSiteImage(e, 'workshop_image_url', setUploadingWorkshop, workshopImgRef as React.RefObject<HTMLInputElement>)} className="hidden" />
            {content.workshop_image_url ? (
              <div className="mt-2 flex items-center gap-3">
                <img src={content.workshop_image_url} alt="" className="h-16 w-24 object-cover border border-ink/20" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => workshopImgRef.current?.click()} disabled={uploadingWorkshop}
                    className="flex items-center gap-1.5 border border-ink/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition hover:border-ink disabled:opacity-50">
                    <Upload size={11} /> {uploadingWorkshop ? 'Uploading…' : 'Replace'}
                  </button>
                  <button type="button" onClick={() => setContent(c => ({ ...c, workshop_image_url: null }))}
                    className="border border-ink/30 p-1.5 transition hover:border-destructive hover:text-destructive">
                    <X size={11} />
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => workshopImgRef.current?.click()} disabled={uploadingWorkshop}
                className="mt-2 flex w-full items-center justify-center gap-2 border border-dashed border-ink/20 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition hover:border-ink hover:text-ink disabled:opacity-50">
                <Upload size={13} /> {uploadingWorkshop ? 'Uploading…' : 'Upload Process Image'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">Stats</h3>
          <button type="button" onClick={addStat} className="flex items-center gap-1 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:text-ink">
            <Plus size={12} /> Add stat
          </button>
        </div>
        <div className="space-y-3">
          {content.stats.map((s, i) => (
            <div key={i} className="flex items-end gap-3">
              <div className="flex-1">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Value</label>
                <input value={s.key} onChange={e => setStat(i, 'key', e.target.value)}
                  className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 text-sm outline-none focus:border-ink" />
              </div>
              <div className="flex-1">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Label</label>
                <input value={s.label} onChange={e => setStat(i, 'label', e.target.value)}
                  className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 text-sm outline-none focus:border-ink" />
              </div>
              <button type="button" onClick={() => removeStat(i)} className="mb-2 border border-ink/20 p-1.5 transition hover:border-destructive hover:text-destructive">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-display text-xl font-bold">Marquee Ticker</h3>
        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Items (one per line)</label>
        <textarea rows={5} value={content.marquee_items.join('\n')} onChange={e => setMarquee(e.target.value)}
          className="mt-1 w-full border border-ink/30 bg-transparent p-2 text-sm outline-none focus:border-ink" />
      </div>

      <div>
        <h3 className="mb-4 font-display text-xl font-bold">Contact Details</h3>
        <div className="space-y-4">
          {textField('Phone number', 'contact_phone')}
          {textField('Email address', 'contact_email')}
          {textField('Business hours', 'contact_hours')}
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-display text-xl font-bold">Footer</h3>
        {textField('Footer tagline', 'footer_tagline')}
      </div>

      <button type="submit" disabled={saving}
        className="bg-ink px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp disabled:opacity-50">
        {saving ? 'Saving…' : 'Save All Content'}
      </button>
    </form>
  )
}
