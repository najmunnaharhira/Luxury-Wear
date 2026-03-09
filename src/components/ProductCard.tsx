interface ProductCardProps {
  image: string;
  name: string;
  price: string;
  originalPrice?: string;
  isNew?: boolean;
}

const ProductCard = ({ image, name, price, originalPrice, isNew }: ProductCardProps) => {
  return (
    <div className="product-card group">
      <div className="relative overflow-hidden bg-secondary">
        {isNew && (
          <span className="absolute top-4 left-4 z-10 text-[10px] font-body font-medium tracking-widest uppercase text-foreground bg-background px-3 py-1">
            New
          </span>
        )}
        <img
          src={image}
          alt={name}
          className="product-image"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-all duration-500" />
        
        {/* Quick view button on hover */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <button className="w-full py-3 bg-foreground text-background text-xs font-body font-medium tracking-widest uppercase transition-all hover:bg-muted-foreground">
            Quick View
          </button>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <h3 className="font-body text-sm font-medium tracking-wide text-foreground group-hover:opacity-70 transition-opacity">
          {name}
        </h3>
        <div className="flex items-center gap-3">
          <span className="font-body text-sm font-medium text-foreground">{price}</span>
          {originalPrice && (
            <span className="font-body text-sm text-muted-foreground line-through">
              {originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;