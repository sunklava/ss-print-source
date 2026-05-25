import { useState, useEffect, useRef, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase, isConfigured } from '@/lib/supabase'
import type { GalleryPost } from '@/lib/db.types'
import SectionHeader from '@/components/SectionHeader'
import logo from '@/assets/logo_transparent_background.png'

function PostCarousel({ images }: { images: GalleryPost['images'] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false })
  const [current, setCurrent] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const paused = useRef(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrent(emblaApi.selectedScrollSnap())
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi, onSelect])

  // Manual autoplay — advances every 3.5 s, pauses on hover/touch
  useEffect(() => {
    if (!emblaApi || images.length <= 1) return
    const tick = setInterval(() => {
      if (paused.current) return
      if (emblaApi.canScrollNext()) emblaApi.scrollNext()
      else emblaApi.scrollTo(0)
    }, 3500)
    return () => clearInterval(tick)
  }, [emblaApi, images.length])

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const goTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  return (
    <section
      aria-label={`Image carousel, ${images.length} slides`}
      aria-roledescription="carousel"
    >
      <div
        className="relative overflow-hidden"
        ref={emblaRef}
        onMouseEnter={() => { paused.current = true }}
        onMouseLeave={() => { paused.current = false }}
        onTouchStart={() => { paused.current = true }}
        onTouchEnd={() => { paused.current = false }}
      >
        {/* Slide track */}
        <div className="flex">
          {images.map((img, i) => (
            <div
              key={img.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${images.length}`}
              className="min-w-0 shrink-0 grow-0 basis-full bg-paper-deep"
            >
              <img
                src={img.image_url}
                alt=""
                loading="lazy"
                className="aspect-square w-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* Visual slide counter — decorative, announced via live region below */}
        <div className="absolute right-3 top-3 bg-black/50 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur-sm" aria-hidden="true">
          {current + 1} / {images.length}
        </div>

        {/* Arrow buttons — desktop only */}
        {canPrev && (
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 hidden items-center justify-center bg-paper/85 p-2 backdrop-blur-sm transition hover:bg-paper md:flex"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
        )}
        {canNext && (
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 hidden items-center justify-center bg-paper/85 p-2 backdrop-blur-sm transition hover:bg-paper md:flex"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        )}

        {/* Dot indicators — no longer aria-hidden; each button has a proper label */}
        <div
          className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5"
          role="group"
          aria-label="Slide navigation"
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current ? true : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Live region — announces current slide to screen readers on change */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {current + 1} of {images.length}
      </p>
    </section>
  )
}

function PostCard({ post }: { post: GalleryPost }) {
  const isCarousel = post.images.length > 1

  return (
    <article className="overflow-hidden border border-ink/10 bg-paper shadow-sm">
      {/* Post header */}
      <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3">
        <img src={logo} alt="SS Print" className="h-9 w-9 shrink-0 object-contain" />
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold leading-tight">SS Print</p>
          <p className="font-mono text-[10px] leading-tight text-muted-foreground">Kingston, JA</p>
        </div>
      </div>

      {/* Image / Carousel */}
      {post.images.length > 0 && (
        isCarousel
          ? <PostCarousel images={post.images} />
          : <img
              src={post.images[0].image_url}
              alt=""
              loading="lazy"
              className="aspect-square w-full object-contain bg-paper-deep"
            />
      )}

      {/* Caption */}
      {post.caption && (
        <div className="px-4 py-3.5">
          <p className="font-mono text-xs leading-relaxed text-ink/80">
            <span className="mr-2 font-semibold text-ink">SS Print</span>
            {post.caption}
          </p>
        </div>
      )}
    </article>
  )
}

const Gallery = () => {
  const [posts, setPosts] = useState<GalleryPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConfigured) { setLoading(false); return }
    supabase!
      .from('gallery_posts')
      .select('*, images:gallery(id, post_id, image_url, order_index)')
      .eq('active', true)
      .order('order_index')
      .then(({ data }) => {
        if (data) {
          setPosts(
            data.map(p => ({
              ...p,
              images: [...(p.images ?? [])].sort((a, b) => a.order_index - b.order_index),
            }))
          )
        }
        setLoading(false)
      })
  }, [])

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Gallery"
          title={<>The <em className="italic font-normal">work.</em></>}
          description="A sample of pieces pressed in the studio. Every job, every size, every print."
          level={1}
        />
      </div>

      {loading ? (
        <p className="mt-16 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Loading…
        </p>
      ) : posts.length === 0 ? (
        <p className="mt-16 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          No posts yet
        </p>
      ) : (
        <div className="mx-auto mt-12 max-w-[540px] space-y-6 px-4 sm:px-0">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Gallery
