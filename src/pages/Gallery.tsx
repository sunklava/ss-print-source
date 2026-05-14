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
        <div className="mt-12 columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
          {images.map((img) => (
            <figure key={img.id} className="group relative mb-3 break-inside-avoid overflow-hidden bg-paper-deep md:mb-4 m-0">
              <img
                src={img.image_url}
                alt={img.caption ?? 'Gallery piece pressed at Sovereign & Sonata'}
                loading="lazy"
                className="w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/30" aria-hidden="true" />
              {img.caption && (
                <figcaption className="absolute left-3 top-3 bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">
                  {img.caption}
                </figcaption>
              )}
            </figure>
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
