import { Outlet, useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useCart } from "@/lib/cart";

const Layout = () => {
  const { key } = useLocation();
  const { isOpen } = useCart();
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bgRef.current) return;
    if (isOpen) {
      bgRef.current.setAttribute("inert", "");
    } else {
      bgRef.current.removeAttribute("inert");
    }
  }, [isOpen]);

  return (
    <div className="paper-grain min-h-screen">
      <div ref={bgRef}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-paper"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">
          <div key={key} className="page-enter">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
