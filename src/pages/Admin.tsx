import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase, isConfigured } from '@/lib/supabase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProductsTab from '@/components/admin/ProductsTab'
import PricingTab from '@/components/admin/PricingTab'
import ContentTab from '@/components/admin/ContentTab'
import OrdersTab from '@/components/admin/OrdersTab'
import GalleryTab from '@/components/admin/GalleryTab'
import { LogOut } from 'lucide-react'

export default function Admin() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    if (!isConfigured) { setLoading(false); return }
    supabase!.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setSigningIn(true)
    const { error } = await supabase!.auth.signInWithPassword({ email, password })
    setSigningIn(false)
    if (error) setAuthError(error.message)
  }

  const logout = () => supabase?.auth.signOut()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Loading…</span>
      </div>
    )
  }

  if (!isConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Supabase not configured</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Copy <code className="bg-paper-deep px-1.5 py-0.5 font-mono text-xs">.env.example</code> to{' '}
            <code className="bg-paper-deep px-1.5 py-0.5 font-mono text-xs">.env</code> and add your Supabase
            project URL and anon key, then run the SQL in{' '}
            <code className="bg-paper-deep px-1.5 py-0.5 font-mono text-xs">supabase/schema.sql</code>.
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          <h1 className="mb-6 text-center font-display text-2xl font-bold">Admin Login</h1>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 text-sm outline-none focus:border-ink" />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 text-sm outline-none focus:border-ink" />
            </div>
            {authError && <p className="text-sm text-destructive">{authError}</p>}
            <button type="submit" disabled={signingIn}
              className="w-full bg-ink py-3 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-stamp disabled:opacity-50">
              {signingIn ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <span className="font-display text-lg font-bold">Admin</span>
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-xs text-muted-foreground md:block">{user.email}</span>
            <button onClick={logout}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:text-ink">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <Tabs defaultValue="products">
          <TabsList className="mb-8 h-auto flex-wrap gap-1 bg-paper-deep p-1">
            {['products', 'pricing', 'content', 'orders', 'gallery'].map(tab => (
              <TabsTrigger key={tab} value={tab}
                className="font-mono text-xs uppercase tracking-[0.15em] data-[state=active]:bg-ink data-[state=active]:text-paper">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="products"><ProductsTab /></TabsContent>
          <TabsContent value="pricing"><PricingTab /></TabsContent>
          <TabsContent value="content"><ContentTab /></TabsContent>
          <TabsContent value="orders"><OrdersTab /></TabsContent>
          <TabsContent value="gallery"><GalleryTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
