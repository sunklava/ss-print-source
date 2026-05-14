import { NavLink, Link } from "react-router-dom";
import logo from "../assets/logo_transparent_background.png";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import CartDrawer from "./CartDrawer";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const { count, setOpen: openCart } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between md:h-20">
          <Link to="/" className="group flex items-center gap-3">
            <img src={logo} alt="Sovereign & Sonata Logo" className="h-14 w-14 object-contain" />
            <span className="font-display text-lg font-bold tracking-tight md:text-xl">
              Sovereign & Sonata
              <span className="ml-2 hidden font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-muted-foreground md:inline">
                est. JA
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `font-mono text-xs uppercase tracking-[0.18em] transition-colors hover:text-ink ${
                    isActive ? "text-ink" : "text-muted-foreground"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openCart(true)}
              className="relative flex items-center gap-2 border border-ink/20 px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] transition hover:border-ink"
              aria-label={count > 0 ? `Open cart, ${count} item${count !== 1 ? 's' : ''}` : 'Open cart'}
            >
              <ShoppingBag size={15} aria-hidden="true" />
              {count > 0 && (
                <span className="font-mono text-xs" aria-hidden="true">{count}</span>
              )}
            </button>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-ink/10 bg-paper md:hidden">
            <nav id="mobile-nav" className="container flex flex-col py-4" aria-label="Mobile navigation">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `border-b border-ink/5 py-3 font-mono text-xs uppercase tracking-[0.18em] ${
                      isActive ? "text-ink" : "text-muted-foreground"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
};

export default Header;
