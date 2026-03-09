import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroImage from "@/assets/hero-image.jpg";
import productBoots1 from "@/assets/product-boots-1.jpg";
import productBoots2 from "@/assets/product-boots-2.jpg";

const textSlides = [
  "Modern Fashion",
  "Luxury Wear", 
  "Bold & Confident",
  "Italian Crafted",
];

const imageSlides = [
  { image: heroImage, alt: "Fashion editorial" },
  { image: productBoots1, alt: "Leather boots collection" },
  { image: productBoots2, alt: "Premium footwear" },
];

const HeroSlideshow = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTextAnimating, setIsTextAnimating] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 0.8]);

  // Text slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTextAnimating(true);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % textSlides.length);
        setIsTextAnimating(false);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imageSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-background"
    >
      {/* Background Images with Parallax */}
      {imageSlides.map((slide, index) => (
        <motion.div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ y: imageY, scale: imageScale }}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      ))}

      {/* Dark gradient overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/80"
        style={{ opacity: overlayOpacity }}
      />

      {/* Center Text Slideshow with Parallax */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ y: textY }}
      >
        <div className="text-center px-4">
          <div className="relative flex items-center justify-center overflow-visible py-8">
            <motion.h1 
              className={`hero-text text-foreground transition-all duration-500 ${
                isTextAnimating 
                  ? "opacity-0 translate-y-[-30px]" 
                  : "opacity-100 translate-y-0"
              }`}
            >
              {textSlides[currentTextIndex]}
            </motion.h1>
          </div>
          
          {/* Subtitle */}
          <motion.p 
            className="mt-4 md:mt-8 font-body text-sm md:text-base tracking-widest uppercase text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Fall / Winter 2025-26 Collection
          </motion.p>

          {/* CTA Button */}
          <motion.div 
            className="mt-8 md:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <button className="btn-outline">
              Explore Collection
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-3">
        {textSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTextAnimating(true);
              setTimeout(() => {
                setCurrentTextIndex(index);
                setIsTextAnimating(false);
              }, 300);
            }}
            className={`h-[2px] transition-all duration-500 ${
              index === currentTextIndex 
                ? "w-8 bg-foreground" 
                : "w-4 bg-foreground/30 hover:bg-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <span className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">
          Scroll
        </span>
        <motion.div 
          className="w-px h-8 bg-gradient-to-b from-foreground/50 to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSlideshow;
