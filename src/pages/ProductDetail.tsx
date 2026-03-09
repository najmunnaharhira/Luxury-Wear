import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/ImageGallery";
import SizeSelector from "@/components/SizeSelector";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(Number(id));
  const { data: allProducts = [] } = useProducts();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeError, setShowSizeError] = useState(false);
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { ref: relatedRef, isInView: relatedInView } = useScrollReveal();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-foreground mb-4">Product Not Found</h1>
          <Link to="/" className="btn-outline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.images[0],
    });
    setShowSizeError(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        {/* Breadcrumb */}
        <div className="px-6 md:px-12 max-w-7xl mx-auto mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Product Content */}
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left - Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ImageGallery images={product.images} productName={product.name} />
            </motion.div>

            {/* Right - Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:sticky lg:top-32 lg:self-start space-y-8"
            >
              {/* Tags */}
              <div className="flex gap-3">
                {product.isNew && (
                  <span className="font-body text-[10px] tracking-widest uppercase text-foreground bg-secondary px-3 py-1">
                    New
                  </span>
                )}
                {product.isSale && (
                  <span className="font-body text-[10px] tracking-widest uppercase text-background bg-foreground px-3 py-1">
                    Sale
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
                  {product.name}
                </h1>
                <div className="mt-4 flex items-center gap-4">
                  <span className="font-body text-xl font-medium text-foreground">
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="font-body text-lg text-muted-foreground line-through">
                      {product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="font-body text-base leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              {/* Size Selector */}
              <div>
                <SizeSelector
                  sizes={product.sizes}
                  selectedSize={selectedSize}
                  onSelect={(size) => {
                    setSelectedSize(size);
                    setShowSizeError(false);
                  }}
                />
                {showSizeError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 font-body text-xs text-destructive"
                  >
                    Please select a size
                  </motion.p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <motion.button
                  onClick={handleAddToCart}
                  className="flex-1 btn-filled"
                  whileTap={{ scale: 0.98 }}
                >
                  Add to Bag
                </motion.button>
                <motion.button
                  onClick={() => toggleItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                  })}
                  className={`w-14 h-14 flex items-center justify-center border transition-colors ${
                    isInWishlist(product.id)
                      ? "border-foreground bg-foreground"
                      : "border-border hover:border-foreground"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isInWishlist(product.id)
                        ? "fill-background text-background"
                        : "text-foreground"
                    }`}
                  />
                </motion.button>
              </div>

              {/* Details */}
              <div className="border-t border-border pt-8">
                <h3 className="font-body text-xs tracking-widest uppercase text-foreground mb-4">
                  Product Details
                </h3>
                <ul className="space-y-2">
                  {product.details.map((detail, index) => (
                    <li
                      key={index}
                      className="font-body text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Product Reviews */}
          <ProductReviews productId={product.id} productName={product.name} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section
            ref={relatedRef}
            className="mt-24 md:mt-32 px-6 md:px-12"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={relatedInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">
                  You May Also Like
                </span>
                <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold text-foreground">
                  Related Products
                </h2>
              </motion.div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {relatedProducts.map((relatedProduct, index) => (
                  <motion.div
                    key={relatedProduct.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={relatedInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link to={`/product/${relatedProduct.id}`}>
                      <ProductCard
                        image={relatedProduct.images[0]}
                        name={relatedProduct.name}
                        price={relatedProduct.price}
                        originalPrice={relatedProduct.originalPrice}
                        isNew={relatedProduct.isNew}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
