import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  const { key } = useLocation();

  return (
    <div className="paper-grain min-h-screen">
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
  );
};

export default Layout;
