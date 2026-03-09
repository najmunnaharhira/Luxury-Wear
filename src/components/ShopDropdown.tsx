import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/useProducts";

const quickLinks = [
  { name: "All Products", href: "/shop" },
  { name: "New Arrivals", href: "/shop?filter=new" },
  { name: "Sale", href: "/shop?filter=sale" },
  { name: "Collections", href: "/collections" },
];

const ShopDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { data: products = [] } = useProducts();

  // Derive categories from products
  const categories = useMemo(() => {
    const categoryMap = new Map<string, { image: string; description: string }>();
    products.forEach((p) => {
      if (!categoryMap.has(p.category) && p.category) {
        categoryMap.set(p.category, {
          image: p.images[0] || "/placeholder.svg",
          description: `Shop ${p.category}`,
        });
      }
    });
    return Array.from(categoryMap.entries())
      .slice(0, 3)
      .map(([name, data]) => ({
        name,
        href: `/shop?category=${name}`,
        image: data.image,
        description: data.description,
      }));
  }, [products]);

  const suggestions = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    const query = searchQuery.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
      .slice(0, 4);
  }, [searchQuery, products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="nav-link text-foreground flex items-center gap-1">
        Shop
        <ChevronDown 
          size={12} 
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50"
          >
            <div className="bg-background border border-border shadow-2xl min-w-[600px]">
              {/* Search Bar */}
              <div className="p-4 border-b border-border">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card border-border focus:ring-primary"
                  />
                </form>
                {searchQuery.trim().length >= 2 && (
                  <div className="mt-2 border border-border bg-background divide-y divide-border">
                    {suggestions.length > 0 ? (
                      suggestions.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          onClick={() => {
                            setIsOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-card transition-colors"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 object-cover"
                          />
                          <div>
                            <p className="font-body text-sm text-foreground">{product.name}</p>
                            <p className="font-body text-xs text-muted-foreground">{product.price}</p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="px-3 py-3 font-body text-sm text-muted-foreground">
                        No products found for "{searchQuery}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-[200px_1fr] divide-x divide-border">
                {/* Quick Links */}
                <div className="p-6">
                  <h3 className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-4">
                    Quick Links
                  </h3>
                  <ul className="space-y-1">
                    {quickLinks.map((link) => (
                      <li key={link.name}>
                        <Link
                          to={link.href}
                          onClick={() => setIsOpen(false)}
                          className="block py-2 font-body text-sm text-foreground hover:text-muted-foreground transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Category Cards with Images */}
                <div className="p-6">
                  <h3 className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-4">
                    Shop by Category
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        to={category.href}
                        onClick={() => setIsOpen(false)}
                        className="group block"
                      >
                        <motion.div 
                          className="aspect-[3/4] overflow-hidden bg-card mb-3 relative"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          <motion.img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                          <motion.div 
                            className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300"
                          />
                        </motion.div>
                        <h4 className="font-display text-base font-medium text-foreground group-hover:text-muted-foreground transition-colors">
                          {category.name}
                        </h4>
                        <p className="font-body text-xs text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Banner */}
              <div className="border-t border-border px-6 py-4 bg-card/50">
                <Link
                  to="/shop?filter=sale"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between group"
                >
                  <div>
                    <span className="font-body text-xs tracking-widest uppercase text-foreground">
                      Winter Sale
                    </span>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      Up to 30% off selected styles
                    </p>
                  </div>
                  <span className="font-body text-xs tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                    Shop Now →
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShopDropdown;
