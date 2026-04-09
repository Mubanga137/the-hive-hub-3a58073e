import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const transactions = [
  { id: 1, label: "African Print Blazer", type: "debit", amount: 450, date: "2026-04-01" },
  { id: 2, label: "Wallet Top-Up", type: "credit", amount: 1000, date: "2026-03-30" },
  { id: 3, label: "Shea Butter Collection", type: "debit", amount: 120, date: "2026-03-20" },
  { id: 4, label: "Wallet Top-Up", type: "credit", amount: 500, date: "2026-03-15" },
  { id: 5, label: "Organic Honey Set", type: "debit", amount: 95, date: "2026-03-15" },
];

const CustomerWallet = () => {
  const { profile } = useAuth();
  const balance = profile?.zmw_balance ?? 1250;

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <Wallet size={24} className="text-primary" /> My Wallet
        </h2>
        <p className="text-muted-foreground mt-1">Manage your Hive wallet balance</p>
      </motion.div>

      {/* Balance Card */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-6 mb-8">
        <p className="text-xs text-muted-foreground mb-1">Available Balance</p>
        <p className="text-4xl font-display font-bold text-foreground">
          ZMW <span className="text-primary">{balance.toLocaleString()}</span>
        </p>
        <div className="flex gap-3 mt-5">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm">
            <Plus size={16} /> Top Up
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border-2 border-border rounded-xl text-foreground hover:bg-secondary transition-colors">
            <CreditCard size={16} /> Link Card
          </motion.button>
        </div>
      </motion.div>

      {/* Transactions */}
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-lg font-display font-bold text-foreground">Recent Transactions</h3>
      </div>
      <div className="space-y-2">
        {transactions.map((tx, i) => (
          <motion.div key={tx.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}
            className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              tx.type === "credit" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
            }`}>
              {tx.type === "credit" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{tx.label}</p>
              <p className="text-[10px] text-muted-foreground">{new Date(tx.date).toLocaleDateString("en-ZM", { month: "short", day: "numeric", year: "numeric" })}</p>
            </div>
            <p className={`text-sm font-bold ${tx.type === "credit" ? "text-emerald-500" : "text-destructive"}`}>
              {tx.type === "credit" ? "+" : "-"} ZMW {tx.amount}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CustomerWallet;
