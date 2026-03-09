import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingCart, Users, Star } from "lucide-react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalReviews: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [products, orders, profiles, reviews] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("product_reviews").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        totalProducts: products.count ?? 0,
        totalOrders: orders.count ?? 0,
        totalUsers: profiles.count ?? 0,
        totalReviews: reviews.count ?? 0,
      });
    };

    fetchStats();
  }, []);

  const cards = [
    { label: "Products", value: stats.totalProducts, icon: Package, color: "text-blue-400" },
    { label: "Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-green-400" },
    { label: "Users", value: stats.totalUsers, icon: Users, color: "text-purple-400" },
    { label: "Reviews", value: stats.totalReviews, icon: Star, color: "text-yellow-400" },
  ];

  return (
    <div className="p-8">
      <h2 className="font-display text-3xl font-semibold text-foreground mb-8">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">
                {card.label}
              </span>
              <card.icon size={20} className={card.color} />
            </div>
            <p className="font-display text-4xl font-semibold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
