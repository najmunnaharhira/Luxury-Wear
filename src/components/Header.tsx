import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Menu, X, ShoppingBag, Search, Heart, User, LogOut, Shield, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import SearchModal from "@/components/SearchModal";
import AuthModal from "@/components/AuthModal";
import ShopDropdown from "@/components/ShopDropdown";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Collections", href: "/collections" },
    { name: "About", href: "/about" },
    { name: "Wishlist", href: "/wishlist" },
  ];

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      setIsAuthOpen(true);
    }
  };

  const menuVariants: Variants = {
    closed: { opacity: 0, x: "100%" },
    open: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  };

  const itemVariants: Variants = {
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-background/95 backdrop-blur-md border-b border-border" 
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <nav className="flex items-center justify-between px-6 md:px-12 py-4 md:py-5">
          {/* Left - Logo */}
          <Link to="/" className="font-display text-xl md:text-2xl font-semibold tracking-wider text-foreground">
            MAISON<span className="font-light">&</span>MAISON
          </Link>

          {/* Center - Menu Items (Desktop) */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {item.name === "Shop" ? (
                  <ShopDropdown />
                ) : (
                  <Link 
                    to={item.href} 
                    className="nav-link text-foreground"
                  >
                    {item.name}
                  </Link>
                )}
              </motion.div>
            ))}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: menuItems.length * 0.1 + 0.3 }}
              >
                <Link to="/admin" className="nav-link text-foreground flex items-center gap-1.5">
                  <Shield size={14} strokeWidth={1.5} />
                  Admin
                </Link>
              </motion.div>
            )}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-5">
            <motion.button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:block text-foreground hover:opacity-60 transition-opacity"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search size={20} strokeWidth={1.5} />
            </motion.button>
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/orders" className="text-foreground hover:opacity-60 transition-opacity">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Package size={20} strokeWidth={1.5} />
                  </motion.div>
                </Link>
                <motion.button
                  onClick={handleAuthClick}
                  className="text-foreground hover:opacity-60 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut size={20} strokeWidth={1.5} />
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={handleAuthClick}
                className="hidden md:flex items-center gap-2 text-foreground hover:opacity-60 transition-opacity"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <User size={20} strokeWidth={1.5} />
              </motion.button>
            )}
            <Link to="/wishlist">
              <motion.div 
                className="hidden md:block text-foreground hover:opacity-60 transition-opacity relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={20} strokeWidth={1.5} />
                <AnimatePresence>
                  {wishlistItems > 0 && (
                    <motion.span 
                      className="absolute -top-1 -right-1 w-4 h-4 bg-foreground text-background text-[10px] font-medium flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {wishlistItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
            <motion.button 
              onClick={() => setIsOpen(true)}
              className="text-foreground hover:opacity-60 transition-opacity relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 w-4 h-4 bg-foreground text-background text-[10px] font-medium flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-1 text-foreground hover:opacity-60 transition-opacity"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-background lg:hidden"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 pt-20">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  custom={index}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                >
                  <Link
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="font-display text-4xl font-medium text-foreground hover:opacity-60 transition-opacity"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div 
                className="flex items-center gap-8 mt-8 pt-8 border-t border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleAuthClick();
                  }} 
                  className="nav-link text-foreground"
                >
                  {user ? "Sign Out" : "Sign In"}
                </button>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="nav-link text-foreground flex items-center gap-1.5"
                  >
                    <Shield size={16} strokeWidth={1.5} />
                    Admin
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Header;
