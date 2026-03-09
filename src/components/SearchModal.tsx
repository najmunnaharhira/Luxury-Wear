import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data: products = [] } = useProducts();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [debouncedQuery, products]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleProductClick = (productId: number) => {
    onClose();
    setQuery("");
    navigate(`/product/${productId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  const popularSearches = ["Boots", "Sneakers", "Loafers", "New Arrivals"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-0 top-0 z-50 p-6 md:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-end mb-8">
                <button
                  onClick={onClose}
                  className="p-2 text-foreground hover:opacity-60 transition-opacity"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full bg-transparent border-0 border-b border-border rounded-none pl-10 pr-4 py-4 font-display text-2xl md:text-3xl placeholder:text-muted-foreground/50 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </form>

              <div className="mt-8">
                {query.trim() === "" ? (
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-4">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 border border-border font-body text-sm text-foreground hover:bg-foreground hover:text-background transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-4">
                      {results.length} Result{results.length !== 1 ? "s" : ""}
                    </p>
                    <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                      {results.map((product, index) => (
                        <motion.button
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleProductClick(product.id)}
                          className="w-full flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors group text-left"
                        >
                          <div className="w-16 h-16 bg-muted overflow-hidden flex-shrink-0">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-display text-lg font-medium text-foreground truncate">
                              {product.name}
                            </p>
                            <p className="font-body text-sm text-muted-foreground">
                              {product.category} · {product.price}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="font-body text-muted-foreground">
                      No products found for "{query}"
                    </p>
                    <Link
                      to="/shop"
                      onClick={onClose}
                      className="inline-block mt-4 font-body text-sm text-foreground hover:opacity-60 transition-opacity underline underline-offset-4"
                    >
                      Browse all products
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
