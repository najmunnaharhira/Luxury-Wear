import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useProducts";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Wishlist = () => {
  const { items, removeItem } = useWishlist();
  const { addItem: addToCart, setIsOpen: openCart } = useCart();
  const { data: products = [] } = useProducts();
  const { ref: headerRef, isInView: headerInView } = useScrollReveal();

  const handleAddToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        size: product.sizes[0],
        image: product.images[0],
      });
      openCart(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        <div ref={headerRef} className="px-6 md:px-12 max-w-7xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">
              Your Favorites
            </span>
            <h1 className="mt-4 font-display text-5xl md:text-7xl font-semibold text-foreground">
              Wishlist
            </h1>
          </motion.div>
        </div>

        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Heart className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
              <h2 className="font-display text-2xl text-foreground mb-4">
                Your wishlist is empty
              </h2>
              <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
                Save your favorite items to your wishlist and they'll appear here for easy access.
              </p>
              <Link to="/shop" className="btn-outline">
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-body text-sm text-muted-foreground mb-8"
              >
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group relative bg-secondary p-6"
                    >
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-background hover:bg-muted transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <Link to={`/product/${item.id}`} className="block">
                        <div className="aspect-[3/4] overflow-hidden mb-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </Link>

                      <div className="space-y-2">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="font-body text-sm font-medium text-foreground group-hover:opacity-70 transition-opacity">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="font-body text-sm font-medium text-foreground">
                          {item.price}
                        </p>
                      </div>

                      <motion.button
                        onClick={() => handleAddToCart(item.id)}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-foreground text-background font-body text-xs tracking-widest uppercase hover:bg-muted-foreground transition-colors"
                        whileTap={{ scale: 0.98 }}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Bag
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
