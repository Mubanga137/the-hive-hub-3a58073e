import { motion } from "framer-motion";
import { FileText, Package, Clock, CheckCircle2, XCircle } from "lucide-react";

const demoOrders = [
  { id: "HV-20260401", item: "African Print Blazer", store: "Lusaka Threads", date: "2026-04-01", status: "delivered", amount: 450 },
  { id: "HV-20260328", item: "Wireless Earbuds Pro", store: "TechZone Zambia", date: "2026-03-28", status: "in_transit", amount: 280 },
  { id: "HV-20260320", item: "Shea Butter Collection", store: "Glow Africa", date: "2026-03-20", status: "delivered", amount: 120 },
  { id: "HV-20260315", item: "Organic Honey Set", store: "Harvest Hub", date: "2026-03-15", status: "delivered", amount: 95 },
  { id: "HV-20260310", item: "Solar Power Bank", store: "TechZone Zambia", date: "2026-03-10", status: "cancelled", amount: 210 },
];

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  delivered: { label: "Delivered", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10" },
  in_transit: { label: "In Transit", icon: Package, color: "text-blue-500 bg-blue-500/10" },
  processing: { label: "Processing", icon: Clock, color: "text-primary bg-primary/10" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-destructive bg-destructive/10" },
};

const OrderHistory = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <FileText size={24} className="text-primary" /> Order History
        </h2>
        <p className="text-muted-foreground mt-1">View all your past purchases and transactions</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-4">
          <Package size={20} className="text-primary mb-2" />
          <p className="text-xs text-muted-foreground">Total Orders</p>
          <p className="text-xl font-bold text-foreground">{demoOrders.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-xl p-4">
          <CheckCircle2 size={20} className="text-emerald-500 mb-2" />
          <p className="text-xs text-muted-foreground">Delivered</p>
          <p className="text-xl font-bold text-foreground">{demoOrders.filter(o => o.status === "delivered").length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-4">
          <FileText size={20} className="text-blue-500 mb-2" />
          <p className="text-xs text-muted-foreground">Total Spent</p>
          <p className="text-xl font-bold text-foreground">ZMW {demoOrders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.amount, 0).toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {demoOrders.map((order, i) => {
          const status = statusConfig[order.status];
          const StatusIcon = status.icon;
          return (
            <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status.color}`}>
                <StatusIcon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{order.item}</p>
                <p className="text-xs text-muted-foreground">{order.store} · {order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">ZMW {order.amount}</p>
                <p className="text-[10px] text-muted-foreground">{new Date(order.date).toLocaleDateString("en-ZM", { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderHistory;
