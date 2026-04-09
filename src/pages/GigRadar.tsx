import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Package, Clock, Bike, Zap, CheckCircle } from "lucide-react";
import HoneycombBackground from "@/components/HoneycombBackground";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface OrderItem {
  id: number;
  status: string | null;
  total_price: number | null;
  created_at: string;
  buyer_id: string | null;
  runner_id: number | null;
  item_id: number | null;
}

const stats = [
  { label: "Active Deliveries", value: "—", icon: Package, color: "bg-primary/10 text-primary" },
  { label: "Completed Today", value: "—", icon: Clock, color: "bg-emerald-500/10 text-emerald-600" },
  { label: "Earnings (Today)", value: "—", icon: Zap, color: "bg-blue-500/10 text-blue-600" },
];

const GigRadar = () => {
  const { user } = useAuth();
  const [availableOrders, setAvailableOrders] = useState<OrderItem[]>([]);
  const [myOrders, setMyOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    // Fetch unassigned orders (available gigs)
    const { data: available } = await supabase
      .from("orders")
      .select("*")
      .is("runner_id", null)
      .in("status", ["pending", "processing"])
      .order("created_at", { ascending: false })
      .limit(20);

    setAvailableOrders((available as OrderItem[]) || []);

    // Fetch my accepted orders
    if (user) {
      const { data: mine } = await supabase
        .from("orders")
        .select("*")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      setMyOrders((mine as OrderItem[]) || []);
    }
    setLoading(false);
  };

  const handleAcceptOrder = async (orderId: number) => {
    if (!user) { toast.error("Please log in first."); return; }
    const { error } = await supabase
      .from("orders")
      .update({ status: "in_transit", runner_id: parseInt(user.id.slice(0, 8), 16) % 100000 } as any)
      .eq("id", orderId);

    if (error) { toast.error(error.message); return; }
    toast.success("Order accepted! You're on it 🚴");
    fetchOrders();
  };

  const handleClaimBounty = async (orderId: number) => {
    if (!user) { toast.error("Please log in first."); return; }
    const { error } = await supabase
      .from("orders")
      .update({ status: "delivered" } as any)
      .eq("id", orderId);

    if (error) { toast.error(error.message); return; }
    toast.success("Bounty claimed! Payment will be processed.");
    fetchOrders();
  };

  const activeCount = availableOrders.length;
  const completedCount = myOrders.filter(o => o.status === "delivered").length;

  const dynamicStats = [
    { ...stats[0], value: String(activeCount) },
    { ...stats[1], value: String(completedCount) },
    { ...stats[2], value: `ZMW ${completedCount * 25}` },
  ];

  return (
    <div className="min-h-screen relative">
      <HoneycombBackground />
      <Header />
      <main className="relative z-10 px-4 py-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bike size={22} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              Gig <span className="text-primary">Radar</span>
            </h2>
            <p className="text-sm text-muted-foreground">Logistics Map & Hub Dashboard</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          {dynamicStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center`}><s.icon size={22} /></div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className="text-lg font-display font-bold text-foreground mb-4">Live Delivery Map</h3>
          <div className="relative h-64 rounded-xl bg-secondary/50 border border-border flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Navigation size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Map view coming soon</p>
              <p className="text-xs mt-1">Track deliveries and find nearby hubs in real-time.</p>
            </div>
            <div className="absolute top-8 left-12"><MapPin size={20} className="text-primary" /></div>
            <div className="absolute top-16 right-20"><MapPin size={20} className="text-emerald-500" /></div>
            <div className="absolute bottom-12 left-1/3"><MapPin size={20} className="text-blue-500" /></div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-display font-bold text-foreground mb-2">Available Gigs</h3>
          <p className="text-xs text-muted-foreground mb-4">Nearby delivery requests and hub tasks</p>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent mx-auto" />
            </div>
          ) : availableOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bike size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No active gigs right now.</p>
              <p className="text-xs mt-1">New delivery requests will appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableOrders.map((order) => (
                <motion.div key={order.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Package size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Order #{order.id}</p>
                      <p className="text-xs text-muted-foreground">ZMW {order.total_price || 0} • {order.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleAcceptOrder(order.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
                      <Bike size={14} /> Accept
                    </button>
                    <button onClick={() => handleClaimBounty(order.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/5 transition-colors">
                      <CheckCircle size={14} /> Claim
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GigRadar;
