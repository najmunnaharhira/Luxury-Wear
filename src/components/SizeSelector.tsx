import { useState } from "react";
import { motion } from "framer-motion";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
}

const SizeSelector = ({ sizes, selectedSize, onSelect }: SizeSelectorProps) => {
  const [hoveredSize, setHoveredSize] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">
          Select Size
        </span>
        <button className="font-body text-xs tracking-wide text-muted-foreground hover:text-foreground transition-colors underline">
          Size Guide
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {sizes.map((size) => (
          <motion.button
            key={size}
            onClick={() => onSelect(size)}
            onMouseEnter={() => setHoveredSize(size)}
            onMouseLeave={() => setHoveredSize(null)}
            className={`relative py-3 font-body text-sm transition-all border ${
              selectedSize === size
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-foreground text-foreground"
            }`}
            whileTap={{ scale: 0.98 }}
          >
            {size}
            {hoveredSize === size && selectedSize !== size && (
              <motion.div
                className="absolute inset-0 border border-foreground"
                layoutId="sizeHover"
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
