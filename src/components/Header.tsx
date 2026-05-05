import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/custom", label: "Custom" },
  { to: "/pricing", label: "Pricing" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center bg-ink text-paper font-display text-xl font-black leading-none">
            S
          </span>
          <span className="font-display text-lg font-bold tracking-tight md:text-xl">
            SS Print
            <span className="ml-2 hidden font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-muted-foreground md:inline">
              est. JA
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
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

        <Link
          to="/custom"
          className="hidden bg-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-paper transition hover:bg-stamp md:inline-block"
        >
          Start Order
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-paper md:hidden">
          <nav className="container flex flex-col py-4">
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
  );
};

export default Header;
