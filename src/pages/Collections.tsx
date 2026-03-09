import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  productIds: number[];
}

const collections: Collection[] = [
  {
    id: "winter-essentials",
    name: "Winter Essentials",
    description: "Premium boots and refined styles to brave the cold in elegance",
    image: "/placeholder.svg",
    productIds: [1, 2, 3],
  },
  {
    id: "summer-edit",
    name: "Summer Edit",
    description: "Light, breathable designs for sun-soaked days and warm evenings",
    image: "/placeholder.svg",
    productIds: [4, 5, 6],
  },
  {
    id: "office-classics",
    name: "Office Classics",
    description: "Timeless pieces that command respect in any boardroom",
    image: "/placeholder.svg",
    productIds: [4, 2, 5],
  },
  {
    id: "weekend-leisure",
    name: "Weekend Leisure",
    description: "Comfortable yet sophisticated choices for your days off",
    image: "/placeholder.svg",
    productIds: [5, 6, 1],
  },
];

const Collections = () => {
  const { data: products = [], isLoading } = useProducts();
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const { ref: heroRef, isInView: heroInView } = useScrollReveal();

  const getCollectionProducts = (productIds: number[]) => {
    return productIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean);
  };

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
        {/* Hero Section */}
        <section ref={heroRef} className="px-6 md:px-12 max-w-7xl mx-auto mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">
              Curated Selection
            </span>
            <h1 className="mt-4 font-display text-4xl md:text-6xl font-semibold text-foreground">
              Collections
            </h1>
            <p className="mt-4 font-body text-lg text-muted-foreground max-w-2xl">
              Discover our carefully curated collections, each telling a unique story
              through exceptional craftsmanship and timeless design.
            </p>
          </motion.div>
        </section>

        {/* Collections Grid */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection, index) => {
              const collectionProducts = getCollectionProducts(collection.productIds);
              const isActive = activeCollection === collection.id;

              return (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  {/* Collection Card */}
                  <div
                    className={`relative aspect-[4/3] bg-secondary overflow-hidden cursor-pointer transition-all duration-500 ${
                      isActive ? "aspect-auto" : ""
                    }`}
                    onClick={() => setActiveCollection(isActive ? null : collection.id)}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      {collectionProducts[0] && (
                        <img
                          src={collectionProducts[0].images[0]}
                          alt={collection.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-foreground/40" />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-8">
                      <span className="font-body text-[10px] tracking-widest uppercase text-background/80 mb-2">
                        {collection.productIds.length} Products
                      </span>
                      <h2 className="font-display text-3xl md:text-4xl font-semibold text-background mb-2">
                        {collection.name}
                      </h2>
                      <p className="font-body text-sm text-background/80 max-w-sm">
                        {collection.description}
                      </p>
                      <motion.span
                        className="mt-4 font-body text-xs tracking-widest uppercase text-background flex items-center gap-2"
                        whileHover={{ x: 5 }}
                      >
                        {isActive ? "Close Collection" : "View Collection"} →
                      </motion.span>
                    </div>
                  </div>

                  {/* Expanded Products */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isActive ? "auto" : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-8 grid grid-cols-3 gap-4">
                      {collectionProducts.map((product) =>
                        product ? (
                          <Link key={product.id} to={`/product/${product.id}`}>
                            <ProductCard
                              image={product.images[0]}
                              name={product.name}
                              price={product.price}
                              isNew={product.isNew}
                            />
                          </Link>
                        ) : null
                      )}
                    </div>
                    <Link
                      to="/shop"
                      className="mt-6 block text-center font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                    >
                      View All Products →
                    </Link>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Featured Collection Banner */}
        <section className="mt-24 md:mt-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-[400px] md:h-[500px] bg-secondary overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-xl">
                <span className="font-body text-[10px] tracking-widest uppercase text-background/80 mb-4">
                  Limited Edition
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-semibold text-background mb-4">
                  Artisan Crafted
                </h2>
                <p className="font-body text-base text-background/80 mb-8">
                  Handmade by master craftsmen using traditional techniques passed down
                  through generations. Each piece is a work of art.
                </p>
                <Link to="/shop" className="btn-filled bg-background text-foreground hover:bg-background/90 w-fit">
                  Explore Collection
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Collections;
