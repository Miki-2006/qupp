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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <main className="pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl z-50">
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
                      className="absolute inset-x-4 top-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-b-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-2xl transition-all ${
                      active 
                        ? "bg-gradient-to-r from-purple-100 to-pink-100" 
                        : "group-hover:bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 transition-colors ${
                        active 
                          ? "text-purple-700" 
                          : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    />
                  </motion.div>
                  
                  <span
                    className={`text-xs font-medium mt-1 transition-colors ${
                      active 
                        ? "text-purple-900" 
                        : "text-gray-600 group-hover:text-gray-800"
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