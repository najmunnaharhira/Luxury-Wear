import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

interface OrderItem {
  product_id: number;
  name: string;
  price: string;
  size: string;
  image: string;
  quantity: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const OrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;

    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        navigate("/");
        return;
      }
      setOrder(data);
      setLoading(false);
    };

    fetchOrder();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const items = (order?.items as OrderItem[]) || [];
  const address = order?.shipping_address as ShippingAddress | null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-28 pb-20 px-6 md:px-12 max-w-3xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-500" />
          </motion.div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Order Confirmed
          </h1>
          <p className="font-body text-muted-foreground">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <p className="font-body text-xs text-muted-foreground mt-2">
            Order #{order?.id?.slice(0, 8).toUpperCase()}
          </p>
        </div>

        {/* Order Items */}
        <div className="bg-secondary p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Package size={18} />
            Items Ordered
          </h2>
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-16 aspect-[3/4] bg-muted overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">{item.name}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">
                      Size: {item.size} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-body text-sm text-foreground">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Total */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {address && (
            <div className="bg-secondary p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                Shipping To
              </h3>
              <div className="font-body text-sm text-muted-foreground space-y-1">
                <p className="text-foreground font-medium">{address.firstName} {address.lastName}</p>
                <p>{address.address}</p>
                {address.apartment && <p>{address.apartment}</p>}
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
              </div>
            </div>
          )}
          <div className="bg-secondary p-6">
            <h3 className="font-display text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              Order Total
            </h3>
            <p className="font-body text-2xl font-semibold text-foreground">{order?.total}</p>
            <p className="font-body text-xs text-muted-foreground mt-2 capitalize">
              Status: {order?.status}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders">
            <Button variant="outline" className="flex items-center gap-2">
              View All Orders
            </Button>
          </Link>
          <Link to="/shop">
            <Button className="btn-filled flex items-center gap-2">
              Continue Shopping
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
