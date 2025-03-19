
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import BackgroundScene from "./three/BackgroundScene";
import { AnimatePresence, motion } from "framer-motion";

const Layout = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for the initial animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Three.js background */}
      <BackgroundScene />
      
      {/* Initial loading animation */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="text-5xl font-bold text-gradient mb-4 from-primary via-secondary to-accent">
                PRABAL GOGOI
              </div>
              <motion.div 
                className="h-0.5 bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <div className="text-muted-foreground mt-2 text-center">Portfolio</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 pb-16 pt-24 md:pt-28">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
