export type Product = {
  id: string
  name: string
  category: string
  price: string
  image_url: string | null
  image_position: string | null
  tag: string | null
  order_index: number
  active: boolean
  featured: boolean
}

export type PricingTier = {
  id: string
  name: string
  price: string
  unit: string
  description: string
  features: string[]
  featured: boolean
  order_index: number
}

export type PricingAddon = {
  id: string
  name: string
  price: string
  order_index: number
}

export type SiteContent = {
  id: number
  hero_eyebrow: string
  hero_heading: string
  hero_subtext: string
  hero_image_url: string | null
  workshop_image_url: string | null
  stats: { key: string; label: string }[]
  marquee_items: string[]
  contact_phone: string
  contact_email: string
  contact_hours: string
  footer_tagline: string
}

export type Order = {
  id: string
  created_at: string
  name: string
  email: string
  phone: string | null
  delivery_method: 'pickup' | 'delivery' | null
  address_line1: string | null
  address_city: string | null
  address_parish: string | null
  address_postal: string | null
  product_type: string
  details: string
  quantity: number | null
  status: 'new' | 'in_progress' | 'completed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | null
  payment_id: string | null
  total_amount: number | null
  items: unknown | null
}

export type ProductColor = {
  id: string
  product_id: string
  name: string
  image_url: string | null
  image_position: string | null
  order_index: number
}

export type GalleryImage = {
  id: string
  image_url: string
  caption: string | null
  order_index: number
  active: boolean
}
