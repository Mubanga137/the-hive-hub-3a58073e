import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface CheckoutDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
}

const CheckoutDrawer = ({ open, onOpenChange, item }: CheckoutDrawerProps) => {
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  if (!item) return null;

  const total = item.price * quantity;

  const handleConfirm = async () => {
    if (!user) {
      toast.error("Please log in to place an order.");
      return;
    }
    setSubmitting(true);

    const { error } = await supabase.from("orders").insert({
      buyer_id: user.id,
      item_id: item.id || null,
      total_price: total,
      status: "pending",
      sme_id: item.sme_id || null,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("🎉 Deal locked! Your order has been placed.");
      onOpenChange(false);
      setQuantity(1);
    }
    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[90] bg-card rounded-t-2xl border-t border-primary/20 shadow-2xl max-h-[80vh] overflow-auto"
          >
            <div className="p-5">
              <div className="w-12 h-1 rounded-full bg-border mx-auto mb-4" />

              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-display font-bold text-foreground">Lock This Deal</h3>
                <button onClick={() => onOpenChange(false)} className="p-1.5 rounded-lg hover:bg-secondary">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>

              <div className="flex gap-3 p-3 rounded-xl bg-secondary mb-4">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.item_name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-2xl">🛍️</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{item.item_name}</p>
                  <p className="text-xs text-muted-foreground">{item.store_name}</p>
                  <p className="text-primary font-bold mt-1">ZMW {item.price}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-foreground">Quantity</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary">
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-xl font-bold text-primary">ZMW {total.toFixed(2)}</span>
              </div>

              <button onClick={handleConfirm} disabled={submitting}
                className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 text-sm">
                <Zap size={16} />
                {submitting ? "Processing..." : "CONFIRM & LOCK DEAL"}
              </button>

              <p className="text-[10px] text-muted-foreground text-center mt-3">
                By locking this deal you agree to The Hive's terms of service.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutDrawer;
