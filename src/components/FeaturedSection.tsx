import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import heroImage from "@/assets/hero-image.jpg";

const FeaturedSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref: contentRef, isInView } = useScrollReveal();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-32 px-6 md:px-12 bg-background overflow-x-clip"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left - Text Content with Parallax */}
          <motion.div 
            style={{ y: textY }}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="overflow-visible"
          >
            <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">
              Our Philosophy
            </span>
            <h2 className="mt-4 section-title text-foreground overflow-visible">
              Crafted for<br />Excellence
            </h2>
            <p className="mt-8 font-body text-base md:text-lg leading-relaxed text-muted-foreground max-w-md">
              Each piece in our collection represents the pinnacle of Italian craftsmanship. 
              We blend traditional techniques with contemporary design to create footwear 
              that stands the test of time.
            </p>
            <motion.div 
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button className="btn-outline">
                Discover More
              </button>
            </motion.div>
          </motion.div>

          {/* Right - Image with Parallax */}
          <motion.div 
            style={{ y: imageY }}
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative overflow-hidden"
          >
            <div className="group relative aspect-[4/5] overflow-hidden">
              <motion.img
                src={heroImage}
                alt="Fashion editorial"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
