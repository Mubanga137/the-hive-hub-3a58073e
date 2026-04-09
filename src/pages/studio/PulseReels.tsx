import DashboardLayout from "@/components/DashboardLayout";
import { Video, Plus, Eye, Heart } from "lucide-react";
import { motion } from "framer-motion";

const mockReels = [
  { id: 1, title: "Summer Collection Launch", views: 1240, likes: 89, status: "published" },
  { id: 2, title: "Behind the Scenes", views: 856, likes: 62, status: "published" },
  { id: 3, title: "New Arrivals Teaser", views: 0, likes: 0, status: "draft" },
];

const PulseReels = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Pulse Reels</h1>
          <p className="text-sm text-muted-foreground mt-1">Create short video content to engage customers</p>
        </div>
        <button className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm">
          <Plus size={16} /> New Reel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockReels.map((reel, i) => (
          <motion.div
            key={reel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden"
          >
            <div className="aspect-[9/16] max-h-48 bg-secondary/30 flex items-center justify-center">
              <Video size={40} className="text-muted-foreground/30" />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-foreground truncate">{reel.title}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  reel.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-secondary text-muted-foreground"
                }`}>{reel.status}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Eye size={12} /> {reel.views}</span>
                <span className="flex items-center gap-1"><Heart size={12} /> {reel.likes}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default PulseReels;
