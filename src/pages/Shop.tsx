import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, Heart, Search, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useWishlist } from "@/context/WishlistContext";
import { Slider } from "@/components/ui/slider";

const categories = ["All", "Boots", "Sneakers", "Loafers", "Sandals"];

const priceRanges = [
  { label: "All Prices", min: 0, max: 1000 },
  { label: "Under €300", min: 0, max: 300 },
  { label: "€300 - €400", min: 300, max: 400 },
  { label: "Over €400", min: 400, max: 1000 },
];

const Shop = () => {
  const { data: products = [], isLoading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 600]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "newest">("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const { ref: headerRef, isInView: headerInView } = useScrollReveal();
  const { isInWishlist, toggleItem } = useWishlist();

  // Read URL parameters on mount and when they change
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const filterParam = searchParams.get("filter");
    const searchParam = searchParams.get("search");

    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }

    if (searchParam) {
      setSearchQuery(searchParam);
      setSearchInput(searchParam);
    } else {
      setSearchQuery("");
      setSearchInput("");
    }

    if (filterParam === "new") {
      setSortBy("newest");
    } else if (filterParam === "sale") {
      // Filter by sale items handled in filteredProducts
    }
  }, [searchParams]);

  // Update URL when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    searchParams.delete("filter");
    searchParams.delete("search");
    setSearchQuery("");
    setSearchInput("");
    setSearchParams(searchParams);
  };

  // Clear search
  const clearSearch = () => {
    searchParams.delete("search");
    setSearchQuery("");
    setSearchInput("");
    setSearchParams(searchParams);
  };

  const getNumericPrice = (price: string) => {
    return parseFloat(price.replace("€", ""));
  };

  const filterParam = searchParams.get("filter");
  
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const price = getNumericPrice(product.price);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      
      // Handle search filter
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Handle sale filter
      if (filterParam === "sale" && !product.isSale) {
        return false;
      }
      // Handle new arrivals filter
      if (filterParam === "new" && !product.isNew) {
        return false;
      }
      
      return matchesCategory && matchesPrice && matchesSearch;
    });

    // Sort products
    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
        break;
      case "price-desc":
        result = [...result].sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
        break;
      case "newest":
        result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [selectedCategory, priceRange, sortBy, searchQuery, filterParam, products]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        {/* Page Header */}
        <div ref={headerRef} className="px-6 md:px-12 max-w-7xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">
              {searchQuery ? `Search results for "${searchQuery}"` : "Our Collection"}
            </span>
            <h1 className="mt-4 font-display text-5xl md:text-7xl font-semibold text-foreground">
              Shop All
            </h1>
          </motion.div>
        </div>

        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          {/* Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-border"
          >
            {/* Category Filters - Desktop */}
            <div className="hidden md:flex items-center gap-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`font-body text-xs tracking-widest uppercase transition-all ${
                    selectedCategory === category
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                  {selectedCategory === category && (
                    <motion.div
                      layoutId="categoryUnderline"
                      className="h-px bg-foreground mt-1"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 font-body text-xs tracking-widest uppercase text-foreground"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Sort & Results Count */}
            <div className="flex items-center gap-6">
              <span className="font-body text-xs text-muted-foreground">
                {filteredProducts.length} Products
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="font-body text-xs tracking-wide bg-transparent text-foreground border border-border px-4 py-2 focus:outline-none focus:border-foreground"
              >
                <option value="default">Sort by: Default</option>
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </motion.div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mb-8 pb-8 border-b border-border space-y-6"
            >
              {/* Search */}
              <div>
                <h3 className="font-body text-xs tracking-widest uppercase text-foreground mb-4">
                  Search
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSearchInput(val);
                      if (debounceRef.current) clearTimeout(debounceRef.current);
                      debounceRef.current = setTimeout(() => {
                        setSearchQuery(val);
                        if (val) {
                          searchParams.set("search", val);
                        } else {
                          searchParams.delete("search");
                        }
                        setSearchParams(searchParams);
                      }, 300);
                    }}
                    className="w-full pl-10 pr-3 py-2 font-body text-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <h3 className="font-body text-xs tracking-widest uppercase text-foreground mb-4">
                  Category
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-4 py-2 font-body text-xs tracking-wide border transition-all ${
                        selectedCategory === category
                          ? "bg-foreground text-background border-foreground"
                          : "border-border text-foreground hover:border-foreground"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-body text-xs tracking-widest uppercase text-foreground mb-4">
                  Price Range: €{priceRange[0]} - €{priceRange[1]}
                </h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={600}
                  step={10}
                  className="w-full"
                />
              </div>
            </motion.div>
          )}

          <div className="flex gap-12">
            {/* Desktop Sidebar Filters */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block w-64 flex-shrink-0 space-y-8"
            >
              {/* Sidebar Search */}
              <div>
                <h3 className="font-body text-xs tracking-widest uppercase text-foreground mb-4">
                  Search
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  className="relative"
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSearchInput(val);
                      if (debounceRef.current) clearTimeout(debounceRef.current);
                      debounceRef.current = setTimeout(() => {
                        setSearchQuery(val);
                        if (val) {
                          searchParams.set("search", val);
                        } else {
                          searchParams.delete("search");
                        }
                        setSearchParams(searchParams);
                      }, 300);
                    }}
                    className="w-full pl-10 pr-3 py-2 font-body text-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                  />
                </form>
              </div>

              {/* Price Range Slider */}
              <div>
                <h3 className="font-body text-xs tracking-widest uppercase text-foreground mb-6">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={600}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between font-body text-sm text-muted-foreground">
                    <span>€{priceRange[0]}</span>
                    <span>€{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Quick Price Filters */}
              <div>
                <h3 className="font-body text-xs tracking-widest uppercase text-foreground mb-4">
                  Quick Filters
                </h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setPriceRange([range.min, range.max > 600 ? 600 : range.max])}
                      className="block w-full text-left font-body text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory !== "All" || priceRange[0] !== 0 || priceRange[1] !== 600 || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setPriceRange([0, 600]);
                    clearSearch();
                  }}
                  className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear All Filters
                </button>
              )}

              {/* Active Search Indicator */}
              {searchQuery && (
                <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border">
                  <span className="font-body text-xs text-muted-foreground">
                    Searching: "{searchQuery}"
                  </span>
                  <button 
                    onClick={clearSearch}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </motion.aside>

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-body text-muted-foreground mb-4">
                    No products found matching your filters.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setPriceRange([0, 600]);
                    }}
                    className="btn-outline"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="relative group"
                    >
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleItem({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.images[0],
                          });
                        }}
                        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-background/80 hover:bg-background transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors ${
                            isInWishlist(product.id)
                              ? "fill-foreground text-foreground"
                              : "text-foreground"
                          }`}
                        />
                      </button>
                      <Link to={`/product/${product.id}`}>
                        <ProductCard
                          image={product.images[0]}
                          name={product.name}
                          price={product.price}
                          originalPrice={product.originalPrice}
                          isNew={product.isNew}
                        />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
