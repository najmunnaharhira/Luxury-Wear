import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  user_id: string;
  status: string;
  total: string;
  items: any[];
  created_at: string;
}

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as Order[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      toast({ title: "Order updated", description: `Status changed to ${newStatus}` });

      // Send email notification (fire-and-forget)
      supabase.functions.invoke("send-order-status-email", {
        body: { orderId, newStatus },
      }).then(({ error: emailError }) => {
        if (emailError) {
          console.error("Failed to send status email:", emailError);
          toast({ title: "Email not sent", description: "Order updated but notification email failed.", variant: "destructive" });
        } else {
          toast({ title: "Email sent", description: "Customer notified of status change." });
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="font-display text-3xl font-semibold text-foreground mb-8">Orders</h2>
        <p className="font-body text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-3xl font-semibold text-foreground">Orders</h2>
        <span className="font-body text-sm text-muted-foreground">{orders.length} total</span>
      </div>

      {orders.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <p className="font-body text-muted-foreground">No orders yet</p>
        </div>
      ) : (
        <div className="border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="text-left px-4 py-3 font-body text-xs tracking-widest uppercase text-muted-foreground">Order ID</th>
                <th className="text-left px-4 py-3 font-body text-xs tracking-widest uppercase text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 font-body text-xs tracking-widest uppercase text-muted-foreground">Total</th>
                <th className="text-left px-4 py-3 font-body text-xs tracking-widest uppercase text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-card/50 transition-colors">
                  <td className="px-4 py-3 font-body text-sm text-foreground font-mono">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-muted-foreground">
                    {format(new Date(order.created_at), "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-foreground">{order.total}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="font-body text-xs bg-card border border-border text-foreground px-2 py-1 focus:outline-none"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
