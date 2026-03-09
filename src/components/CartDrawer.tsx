import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems } = useCart();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace("€", ""));
    return sum + price * item.quantity;
  }, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md bg-background border-l border-border">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="font-display text-2xl font-semibold text-foreground flex items-center gap-3">
            <ShoppingBag className="w-5 h-5" />
            Your Bag ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-180px)]">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="font-body text-muted-foreground">Your bag is empty</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4"
                  >
                    <div className="w-24 aspect-[3/4] bg-secondary overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-body text-sm font-medium text-foreground">
                          {item.name}
                        </h4>
                        <p className="font-body text-xs text-muted-foreground mt-1">
                          Size: {item.size}
                        </p>
                        <p className="font-body text-sm font-medium text-foreground mt-2">
                          {item.price}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-border hover:border-foreground transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-body text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-border hover:border-foreground transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {items.length > 0 && (
            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-muted-foreground">Subtotal</span>
                <span className="font-body text-lg font-medium text-foreground">
                  €{subtotal.toFixed(2)}
                </span>
              </div>
              <p className="font-body text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout
              </p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/checkout");
                }}
                className="w-full btn-filled"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full btn-outline"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
