import { motion } from "framer-motion";

const MarqueeBanner = () => {
  const items = [
    "Free Shipping Worldwide",
    "30-Day Returns",
    "Italian Craftsmanship",
    "New Season Arrivals",
    "Sustainable Materials",
  ];

  return (
    <motion.div 
      className="bg-foreground text-background py-3 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="animate-marquee whitespace-nowrap flex">
        {[...Array(4)].map((_, setIndex) => (
          items.map((item, index) => (
            <span 
              key={`${setIndex}-${index}`} 
              className="text-xs font-body font-medium tracking-widest uppercase mx-12 inline-flex items-center gap-4"
            >
              <span>{item}</span>
              <span className="w-1.5 h-1.5 bg-background/40 rounded-full" />
            </span>
          ))
        ))}
      </div>
    </motion.div>
  );
};

export default MarqueeBanner;
