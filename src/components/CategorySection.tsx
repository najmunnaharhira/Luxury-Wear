import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import productBoots1 from "@/assets/product-boots-1.jpg";
import productSneaker1 from "@/assets/product-sneaker-1.jpg";
import productLoafer1 from "@/assets/product-loafer-1.jpg";
import productBoots3 from "@/assets/product-boots-3.jpg";

const categories = [
  { name: "Boots", count: 48, image: productBoots1 },
  { name: "Sneakers", count: 32, image: productSneaker1 },
  { name: "Loafers", count: 24, image: productLoafer1 },
  { name: "Sandals", count: 18, image: productBoots3 },
];

const CategorySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref: contentRef, isInView } = useScrollReveal();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [30, -20]);

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-32 px-6 md:px-12 bg-secondary overflow-hidden"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto">
        {/* Section Header with Parallax */}
        <motion.div 
          style={{ y: headerY }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.span 
            className="font-body text-xs tracking-widest uppercase text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Collections
          </motion.span>
          <motion.h2 
            className="mt-4 font-display text-4xl md:text-6xl font-semibold tracking-tight text-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Shop by Category
          </motion.h2>
        </motion.div>

        {/* Categories Grid with Staggered Animation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.a
              key={category.name}
              href="#"
              className="group relative aspect-[3/4] overflow-hidden"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ y: -5 }}
            >
              {/* Background Image with Hover Scale */}
              <motion.img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-background/50 group-hover:bg-background/40 transition-all duration-500" />
              
              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center text-center p-6">
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
                  {category.name}
                </h3>
                <span className="mt-2 font-body text-xs tracking-widest uppercase text-muted-foreground">
                  {category.count} Items
                </span>
                
                {/* Hover Line */}
                <motion.div 
                  className="mt-6 h-px bg-foreground"
                  initial={{ width: 0 }}
                  whileHover={{ width: 48 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
