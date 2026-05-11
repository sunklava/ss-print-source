import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { GalleryImage } from '@/lib/db.types'
import { Upload, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

export default function GalleryTab() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const { data } = await supabase!.from('gallery').select('*').order('order_index')
    setImages(data ?? [])
  }

  useEffect(() => { load() }, [])

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error: uploadError } = await supabase!.storage.from('gallery').upload(path, file)
    if (uploadError) { toast.error('Upload failed: ' + uploadError.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase!.storage.from('gallery').getPublicUrl(path)
    const next = images.length ? Math.max(...images.map(i => i.order_index)) + 1 : 1
    const { error } = await supabase!.from('gallery').insert({ image_url: publicUrl, order_index: next })
    if (error) { toast.error('Failed to save image'); setUploading(false); return }
    toast.success('Image uploaded')
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
    load()
  }

  const updateCaption = async (id: string, caption: string) => {
    await supabase!.from('gallery').update({ caption }).eq('id', id)
  }

  const toggleActive = async (img: GalleryImage) => {
    await supabase!.from('gallery').update({ active: !img.active }).eq('id', img.id)
    load()
  }

  const remove = async (img: GalleryImage) => {
    if (!confirm('Delete this image?')) return
    const path = img.image_url.split('/gallery/')[1]
    if (path) await supabase!.storage.from('gallery').remove([path])
    await supabase!.from('gallery').delete().eq('id', img.id)
    toast.success('Image deleted')
    load()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Gallery</h2>
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={upload} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp disabled:opacity-50"
          >
            <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload Image'}
          </button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="border border-ink/15 p-16 text-center">
          <Upload size={24} className="mx-auto mb-3 text-muted-foreground" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">No images yet — upload your first</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {images.map(img => (
            <div key={img.id} className={`overflow-hidden border border-ink/15 ${!img.active ? 'opacity-50' : ''}`}>
              <div className="relative aspect-square bg-paper-deep">
                <img src={img.image_url} alt={img.caption ?? ''} className="h-full w-full object-cover" />
                <div className="absolute right-2 top-2 flex gap-1">
                  <button onClick={() => toggleActive(img)} className="bg-paper/90 p-1.5 backdrop-blur-sm transition hover:bg-paper" title={img.active ? 'Hide' : 'Show'}>
                    {img.active ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <button onClick={() => remove(img)} className="bg-paper/90 p-1.5 backdrop-blur-sm transition hover:bg-paper hover:text-destructive">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <input
                  defaultValue={img.caption ?? ''}
                  onBlur={e => updateCaption(img.id, e.target.value)}
                  placeholder="Add a caption…"
                  className="w-full bg-transparent font-mono text-xs text-muted-foreground outline-none placeholder:text-ink/20 focus:text-ink"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
