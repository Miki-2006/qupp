import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Home, BookOpen, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { name: "Home", url: createPageUrl("Home"), icon: Home },
    { name: "Quotes", url: createPageUrl("Quotes"), icon: BookOpen },
    { name: "Favorites", url: createPageUrl("Favorites"), icon: Heart }
  ];

  const isActive = (url) => location.pathname === url;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
      <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to={createPageUrl("Home")} className="inline-flex items-center">
            <img
              src="/qupp-logo.png"
              alt="qupp"
              className="h-[6.75rem] w-auto object-contain"
            />
          </Link>
          <button className="px-4 py-1.5 text-sm font-semibold rounded-full border border-brand-200 text-brand-800 bg-white hover:bg-brand-50 transition">
            Вход
          </button>
        </div>
      </header>

      <main className="pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-brand-200 shadow-[0_-8px_30px_rgba(79,132,223,0.12)] z-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-around items-center h-20">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.url);
              
              return (
                <Link
                  key={item.name}
                  to={item.url}
                  className="relative flex flex-col items-center justify-center flex-1 h-full group"
                >
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-x-4 top-0 h-1 bg-gradient-to-r from-brand-500 via-brand-700 to-accent-500 rounded-b-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-2xl transition-all ${
                      active 
                        ? "bg-gradient-to-r from-brand-100 to-cyan-100" 
                        : "group-hover:bg-brand-50"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 transition-colors ${
                        active 
                          ? "text-brand-700" 
                          : "text-slate-500 group-hover:text-brand-700"
                      }`}
                    />
                  </motion.div>
                  
                  <span
                    className={`text-xs font-medium mt-1 transition-colors ${
                      active 
                        ? "text-brand-900" 
                        : "text-slate-600 group-hover:text-brand-800"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}