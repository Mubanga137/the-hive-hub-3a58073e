import DashboardLayout from "@/components/DashboardLayout";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

const mockOrders = [
  { id: "ORD-001", customer: "Mwamba Chanda", items: 3, total: 850, status: "delivered", date: "2026-03-28" },
  { id: "ORD-002", customer: "Natasha Banda", items: 1, total: 350, status: "processing", date: "2026-03-30" },
  { id: "ORD-003", customer: "Joseph Mulenga", items: 2, total: 1200, status: "pending", date: "2026-03-31" },
  { id: "ORD-004", customer: "Grace Tembo", items: 5, total: 2100, status: "shipped", date: "2026-04-01" },
  { id: "ORD-005", customer: "Peter Mumba", items: 1, total: 580, status: "pending", date: "2026-04-01" },
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
};

const Orders = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search orders..." className="pl-9 pr-4 py-2 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 w-48" />
          </div>
        </div>
      </div>

      <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Order ID</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Customer</th>
                <th className="text-center px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Items</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Total</th>
                <th className="text-center px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/30 last:border-0 hover:bg-secondary/20 cursor-pointer"
                >
                  <td className="px-5 py-4 text-sm font-mono font-semibold text-primary">{order.id}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{order.customer}</td>
                  <td className="px-5 py-4 text-sm text-center text-muted-foreground hidden sm:table-cell">{order.items}</td>
                  <td className="px-5 py-4 text-sm text-right font-semibold text-foreground">ZMW {order.total.toLocaleString()}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${statusColors[order.status]}`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-right text-muted-foreground hidden md:table-cell">{order.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default Orders;
