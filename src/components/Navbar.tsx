
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CircuitBoard, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  const navbarClasses = `fixed top-0 left-0 right-0 z-30 py-4 transition-all duration-300 ${
    scrolled ? "bg-background/80 backdrop-blur-lg shadow-md" : "bg-transparent"
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-bold text-foreground"
          >
            <CircuitBoard className="w-6 h-6 text-primary" />
            <span className="font-mono">PRABAL.DEV</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink 
                key={link.path} 
                to={link.path} 
                active={location.pathname === link.path}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <button className="md:hidden focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <motion.div 
        className="md:hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        {isOpen && (
          <div className="px-4 py-4 space-y-2 bg-card/80 backdrop-blur-lg mt-2">
            {navLinks.map((link) => (
              <NavLink 
                key={link.path} 
                to={link.path} 
                mobile 
                active={location.pathname === link.path}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        )}
      </motion.div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  active?: boolean;
  mobile?: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, active, mobile, children }: NavLinkProps) => {
  const mobileClasses = mobile
    ? "block py-2 px-4 text-foreground hover:bg-muted rounded transition-colors"
    : "relative font-medium text-sm transition-colors";

  return (
    <Link to={to} className={mobileClasses}>
      {children}
      {active && !mobile && (
        <motion.div 
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
          layoutId="navbar-indicator"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  );
};

export default Navbar;
