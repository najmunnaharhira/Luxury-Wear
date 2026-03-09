import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import ProductCard from "./ProductCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useProducts } from "@/hooks/useProducts";

const NewArrivals = () => {
  const { data: products = [] } = useProducts();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref: contentRef, isInView } = useScrollReveal();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [50, -30]);

  // Get first 4 products
  const displayProducts = products.slice(0, 4);

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-32 px-6 md:px-12 bg-background"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto">
        {/* Section Header with Parallax */}
        <motion.div 
          style={{ y: headerY }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">
              Just Dropped
            </span>
            <h2 className="mt-4 section-title text-foreground">
              New Arrivals
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a 
              href="#" 
              className="mt-6 md:mt-0 nav-link text-foreground inline-block"
            >
              View All Products
            </a>
          </motion.div>
        </motion.div>

        {/* Products Grid with Staggered Animation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
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

        {/* View All Button */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <button className="btn-outline">
            Shop All New Arrivals
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default NewArrivals;
