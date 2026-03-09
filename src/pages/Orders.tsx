import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
  product_id: number;
  name: string;
  price: string;
  size: string;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: string;
  status: string;
  created_at: string;
}

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(
          data.map((o) => ({
            ...o,
            items: (o.items as unknown as OrderItem[]) || [],
          }))
        );
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user, navigate]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-28 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
            Your Account
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-10">
            Order History
          </h1>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-20"
          >
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <h2 className="font-display text-xl font-medium text-foreground mb-2">
              No orders yet
            </h2>
            <p className="font-body text-muted-foreground mb-6">
              When you place an order, it will appear here.
            </p>
            <Link to="/shop">
              <Button className="btn-filled">Start Shopping</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  to={`/order-confirmation/${order.id}`}
                  className="block border border-border hover:border-foreground/30 transition-colors group"
                >
                  <div className="p-6">
                    {/* Order header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                      <div className="flex items-center gap-3">
                        <Package size={18} className="text-muted-foreground" />
                        <div>
                          <p className="font-body text-xs text-muted-foreground">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="font-body text-xs text-muted-foreground mt-0.5">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={`capitalize text-xs ${statusColor[order.status] || "border-border text-muted-foreground"}`}
                        >
                          {order.status}
                        </Badge>
                        <ChevronRight
                          size={16}
                          className="text-muted-foreground group-hover:text-foreground transition-colors"
                        />
                      </div>
                    </div>

                    {/* Item thumbnails */}
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 4).map((item, i) => (
                          <div
                            key={i}
                            className="w-12 h-12 border-2 border-background bg-muted overflow-hidden flex-shrink-0"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-12 h-12 border-2 border-background bg-muted flex items-center justify-center flex-shrink-0">
                            <span className="font-body text-xs text-muted-foreground">
                              +{order.items.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-auto text-right">
                        <p className="font-body text-sm font-medium text-foreground">
                          {order.total}
                        </p>
                        <p className="font-body text-xs text-muted-foreground">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
