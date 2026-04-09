import { motion } from "framer-motion";
import { MapPin, Package, Truck, CheckCircle2, Clock } from "lucide-react";

const activeOrders = [
  {
    id: "HV-20260401",
    item: "African Print Blazer",
    store: "Lusaka Threads",
    status: "out_for_delivery",
    eta: "Today, 3:00 PM",
    steps: [
      { label: "Order Placed", done: true },
      { label: "Confirmed", done: true },
      { label: "Shipped", done: true },
      { label: "Out for Delivery", done: true },
      { label: "Delivered", done: false },
    ],
  },
  {
    id: "HV-20260328",
    item: "Wireless Earbuds Pro",
    store: "TechZone Zambia",
    status: "shipped",
    eta: "Apr 9, 2026",
    steps: [
      { label: "Order Placed", done: true },
      { label: "Confirmed", done: true },
      { label: "Shipped", done: true },
      { label: "Out for Delivery", done: false },
      { label: "Delivered", done: false },
    ],
  },
];

const TrackOrders = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <MapPin size={24} className="text-primary" /> Track My Orders
        </h2>
        <p className="text-muted-foreground mt-1">Real-time tracking for your active orders</p>
      </motion.div>

      {activeOrders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No active orders to track</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeOrders.map((order, i) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-sm font-bold text-foreground">{order.item}</p>
                  <p className="text-xs text-muted-foreground">{order.store} · {order.id}</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    <Truck size={12} /> ETA: {order.eta}
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center gap-0">
                {order.steps.map((step, si) => (
                  <div key={si} className="flex-1 flex flex-col items-center relative">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 ${
                      step.done ? "bg-primary text-primary-foreground" : "bg-secondary border-2 border-border text-muted-foreground"
                    }`}>
                      {step.done ? <CheckCircle2 size={14} /> : <Clock size={12} />}
                    </div>
                    <p className={`text-[9px] mt-1.5 text-center font-medium ${step.done ? "text-primary" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    {si < order.steps.length - 1 && (
                      <div className={`absolute top-3.5 left-[calc(50%+14px)] w-[calc(100%-28px)] h-0.5 ${
                        step.done && order.steps[si + 1]?.done ? "bg-primary" : step.done ? "bg-primary/40" : "bg-border"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackOrders;
