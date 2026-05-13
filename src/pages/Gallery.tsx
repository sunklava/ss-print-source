import { useState, useEffect } from 'react'
import SectionHeader from "@/components/SectionHeader"
import { supabase, isConfigured } from '@/lib/supabase'
import type { GalleryImage } from '@/lib/db.types'

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([])

  useEffect(() => {
    if (!isConfigured) return
    supabase!.from('gallery').select('*').eq('active', true).order('order_index')
      .then(({ data }) => { if (data) setImages(data) })
  }, [])

  return (
    <section className="container py-16 md:py-24">
      <SectionHeader
        eyebrow="Gallery"
        title={<>The <em className="italic font-normal">work.</em></>}
        description="A sample of pieces pressed in the studio. Every job, every size, every print."
      />

      {images.length > 0 ? (
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden bg-paper-deep">
              <img
                src={img.image_url}
                alt={img.caption ?? ''}
                loading="lazy"
                className="aspect-square w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/30" />
              {img.caption && (
                <div className="absolute left-3 top-3 bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          No gallery images yet
        </p>
      )}
    </section>
  )
}

export default Gallery
