import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { GalleryPost } from '@/lib/db.types'
import { Upload, Trash2, Eye, EyeOff, Plus, X, Image } from 'lucide-react'
import { toast } from 'sonner'

export default function GalleryTab() {
  const [posts, setPosts] = useState<GalleryPost[]>([])
  const [creating, setCreating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [newCaption, setNewCaption] = useState('')
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const { data } = await supabase!
      .from('gallery_posts')
      .select('*, images:gallery(id, post_id, image_url, order_index)')
      .order('order_index')
    if (data) {
      setPosts(
        data.map(p => ({
          ...p,
          images: [...(p.images ?? [])].sort((a, b) => a.order_index - b.order_index),
        }))
      )
    }
  }

  useEffect(() => { load() }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setPendingFiles(prev => [...prev, ...files])
    if (fileRef.current) fileRef.current.value = ''
  }

  const cancelCreate = () => {
    setCreating(false)
    setPendingFiles([])
    setNewCaption('')
  }

  const createPost = async () => {
    if (pendingFiles.length === 0) { toast.error('Add at least one image'); return }
    setUploading(true)

    const nextIndex = posts.length ? Math.max(...posts.map(p => p.order_index)) + 1 : 1
    const { data: post, error: postError } = await supabase!
      .from('gallery_posts')
      .insert({ caption: newCaption.trim() || null, order_index: nextIndex })
      .select()
      .single()

    if (postError || !post) {
      toast.error('Failed to create post')
      setUploading(false)
      return
    }

    const inserts: { post_id: string; image_url: string; order_index: number }[] = []
    for (let i = 0; i < pendingFiles.length; i++) {
      const file = pendingFiles[i]
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${i}.${ext}`
      const { error: uploadErr } = await supabase!.storage.from('gallery').upload(path, file)
      if (uploadErr) { toast.error(`Failed to upload image ${i + 1}`); continue }
      const { data: { publicUrl } } = supabase!.storage.from('gallery').getPublicUrl(path)
      inserts.push({ post_id: post.id, image_url: publicUrl, order_index: i + 1 })
    }

    if (inserts.length > 0) await supabase!.from('gallery').insert(inserts)

    toast.success(inserts.length > 1 ? 'Carousel post created' : 'Post created')
    cancelCreate()
    setUploading(false)
    load()
  }

  const updateCaption = async (id: string, caption: string) => {
    await supabase!.from('gallery_posts').update({ caption: caption.trim() || null }).eq('id', id)
  }

  const toggleActive = async (post: GalleryPost) => {
    await supabase!.from('gallery_posts').update({ active: !post.active }).eq('id', post.id)
    load()
  }

  const removePost = async (post: GalleryPost) => {
    if (!confirm('Delete this post and all its images?')) return
    for (const img of post.images) {
      const path = img.image_url.split('/gallery/')[1]
      if (path) await supabase!.storage.from('gallery').remove([path])
    }
    await supabase!.from('gallery_posts').delete().eq('id', post.id)
    toast.success('Post deleted')
    load()
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Gallery</h2>
        {!creating ? (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 bg-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp"
          >
            <Plus size={14} /> New Post
          </button>
        ) : (
          <button
            onClick={cancelCreate}
            className="flex items-center gap-2 border border-ink/20 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] transition hover:border-ink"
          >
            <X size={14} /> Cancel
          </button>
        )}
      </div>

      {/* New post form */}
      {creating && (
        <div className="mb-8 space-y-5 border border-ink/15 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            New Post
          </p>

          {/* Image grid + add button */}
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {pendingFiles.map((file, i) => (
              <div key={i} className="relative aspect-square overflow-hidden bg-paper-deep">
                <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => setPendingFiles(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute right-1 top-1 bg-ink/70 p-0.5 text-paper transition hover:bg-ink"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            <button
              onClick={() => fileRef.current?.click()}
              className="aspect-square flex flex-col items-center justify-center gap-1 border border-dashed border-ink/30 transition hover:border-ink"
            >
              <Upload size={14} className="text-muted-foreground" />
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">Add</span>
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />

          {/* Caption */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Caption (optional)
            </label>
            <textarea
              value={newCaption}
              onChange={e => setNewCaption(e.target.value)}
              rows={2}
              placeholder="Write a caption…"
              className="mt-1 w-full resize-none border-b border-ink/30 bg-transparent py-2 font-mono text-xs outline-none placeholder:text-ink/20 focus:border-ink"
            />
          </div>

          {/* Submit row */}
          <div className="flex items-center gap-4">
            <button
              onClick={createPost}
              disabled={uploading || pendingFiles.length === 0}
              className="bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp disabled:opacity-40"
            >
              {uploading ? 'Creating…' : pendingFiles.length > 1 ? 'Create Carousel' : 'Create Post'}
            </button>
            <span className="font-mono text-[10px] text-muted-foreground">
              {pendingFiles.length === 0
                ? 'No images selected'
                : `${pendingFiles.length} image${pendingFiles.length > 1 ? 's' : ''} · ${pendingFiles.length > 1 ? 'carousel' : 'standalone'}`}
            </span>
          </div>
        </div>
      )}

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="border border-ink/15 p-16 text-center">
          <Image size={24} className="mx-auto mb-3 text-muted-foreground" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            No posts yet — create your first
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div
              key={post.id}
              className={`overflow-hidden border border-ink/15 transition ${!post.active ? 'opacity-50' : ''}`}
            >
              {/* Image strip */}
              <div className="flex gap-2 overflow-x-auto p-3" style={{ scrollbarWidth: 'thin' }}>
                {post.images.length === 0 ? (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center bg-paper-deep">
                    <span className="font-mono text-[9px] text-muted-foreground">No images</span>
                  </div>
                ) : (
                  post.images.map(img => (
                    <div key={img.id} className="h-20 w-20 shrink-0 overflow-hidden bg-paper-deep">
                      <img src={img.image_url} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))
                )}
              </div>

              {/* Caption + controls */}
              <div className="flex items-start gap-3 border-t border-ink/10 px-4 py-3">
                <div className="min-w-0 flex-1">
                  {post.images.length > 1 && (
                    <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                      Carousel · {post.images.length} images
                    </p>
                  )}
                  <input
                    defaultValue={post.caption ?? ''}
                    onBlur={e => updateCaption(post.id, e.target.value)}
                    placeholder="Add a caption…"
                    className="w-full bg-transparent font-mono text-xs text-muted-foreground outline-none placeholder:text-ink/20 focus:text-ink"
                  />
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    onClick={() => toggleActive(post)}
                    title={post.active ? 'Hide post' : 'Show post'}
                    className="p-1.5 text-muted-foreground transition hover:text-ink"
                  >
                    {post.active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => removePost(post)}
                    title="Delete post"
                    className="p-1.5 text-muted-foreground transition hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
