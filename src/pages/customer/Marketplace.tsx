import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag, TrendingUp, Zap, Sparkles, Heart,
  Smartphone, Shirt, Music, UtensilsCrossed, FolderOpen, Search, SlidersHorizontal
} from "lucide-react";
import FeaturedItemCard, { type FeaturedItem } from "@/components/FeaturedItemCard";
import CheckoutDrawer from "@/components/CheckoutDrawer";
import { useAuth } from "@/hooks/useAuth";

const categoryCards = [
  { label: "Tech", emoji: "📱", icon: Smartphone, color: "from-blue-500/20 to-blue-600/10" },
  { label: "Fashion", emoji: "👗", icon: Shirt, color: "from-pink-500/20 to-pink-600/10" },
  { label: "Food", emoji: "🍟", icon: UtensilsCrossed, color: "from-orange-500/20 to-orange-600/10" },
  { label: "Entertainment", emoji: "🎬", icon: Music, color: "from-purple-500/20 to-purple-600/10" },
  { label: "Beauty", emoji: "💄", icon: Sparkles, color: "from-rose-500/20 to-rose-600/10" },
];

const demoItems: FeaturedItem[] = [
  { id: 1, item_name: "African Print Blazer", price: 450, old_price: 600, store_name: "Lusaka Threads", category: "Fashion", item_type: "product", rating: 4.6, review_count: 145, in_stock: true, fast_delivery: true, free_shipping: true, is_featured: true },
  { id: 2, item_name: "Wireless Earbuds Pro", price: 280, old_price: 350, store_name: "TechZone Zambia", category: "Tech", item_type: "product", rating: 4.8, review_count: 312, in_stock: true, fast_delivery: true },
  { id: 3, item_name: "Shea Butter Collection", price: 120, old_price: 180, store_name: "Glow Africa", category: "Beauty", item_type: "product", rating: 4.3, review_count: 89, in_stock: true, free_shipping: true, is_featured: true, discount_percent: 30 },
  { id: 4, item_name: "Handwoven Basket Bag", price: 320, store_name: "Craft & Culture", category: "Fashion", item_type: "product", rating: 4.9, review_count: 67, in_stock: true, fast_delivery: true },
  { id: 5, item_name: "Organic Honey Set", price: 95, old_price: 130, store_name: "Harvest Hub", category: "Food", item_type: "product", rating: 4.5, review_count: 203, in_stock: true, fast_delivery: true, free_shipping: true, is_featured: true },
  { id: 6, item_name: "Solar Power Bank", price: 210, old_price: 280, store_name: "TechZone Zambia", category: "Tech", item_type: "product", rating: 4.2, review_count: 156, in_stock: true },
  { id: 7, item_name: "Hair Styling Session", price: 150, store_name: "Glow Africa", category: "Beauty", item_type: "service", rating: 4.7, review_count: 44, in_stock: true },
  { id: 8, item_name: "Ankara Sneakers", price: 380, old_price: 500, store_name: "Lusaka Threads", category: "Fashion", item_type: "product", rating: 4.7, review_count: 98, in_stock: true, fast_delivery: true, free_shipping: true, is_featured: true },
  { id: 9, item_name: "DJ Session Booking", price: 500, store_name: "Beats Zambia", category: "Entertainment", item_type: "service", rating: 4.4, review_count: 22, in_stock: true },
  { id: 10, item_name: "Natural Hair Oil", price: 75, old_price: 100, store_name: "Glow Africa", category: "Beauty", item_type: "product", rating: 4.4, review_count: 178, in_stock: true, fast_delivery: true },
];

const hotDeals = demoItems.filter(i => i.old_price).slice(0, 5);
const trendingItems = [...demoItems].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 5);

const HorizontalScrollRow = ({ title, icon, items, badge, variant = "default" }: { title: string; icon: React.ReactNode; items: FeaturedItem[]; badge?: string; variant?: "default" | "hot" | "trending" }) => {
  const [selectedItem, setSelectedItem] = useState<FeaturedItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const badgeClass = variant === "hot" ? "bg-red-500 text-white" : variant === "trending" ? "bg-orange-500 text-white" : "bg-destructive text-destructive-foreground";

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-lg font-display font-bold text-foreground">{title}</h3>
        {badge && <span className={`${badgeClass} text-[10px] font-bold px-2 py-0.5 rounded-full`}>{badge}</span>}
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {items.map((item, i) => (
          <div key={item.id} className="flex-shrink-0 w-[220px]">
            <FeaturedItemCard item={item} index={i} variant={variant} onBuyNow={(it) => { setSelectedItem(it); setDrawerOpen(true); }} />
          </div>
        ))}
      </div>
      <CheckoutDrawer open={drawerOpen} onOpenChange={setDrawerOpen} item={selectedItem} />
    </div>
  );
};

const Marketplace = () => {
  const { profile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<FeaturedItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const userPreferences = profile?.preferences?.filter(p => !p.startsWith("philosophy:")) || [];
  const recommendedItems = userPreferences.length > 0
    ? demoItems.filter(i => userPreferences.includes(i.category))
    : demoItems.slice(0, 5);

  const filteredItems = demoItems.filter(item => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSearch = !searchQuery || item.item_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <ShoppingBag size={24} className="text-primary" /> Marketplace
        </h2>
        <p className="text-muted-foreground mt-1">Browse products, services, and exclusive deals</p>
      </motion.div>

      {/* Search Bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products, services, stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>
        <button className="px-4 py-3 rounded-xl bg-card border border-border hover:bg-secondary transition-colors">
          <SlidersHorizontal size={18} className="text-muted-foreground" />
        </button>
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 pb-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            !selectedCategory ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-secondary"
          }`}
        >
          All
        </button>
        {categoryCards.map(cat => (
          <button
            key={cat.label}
            onClick={() => setSelectedCategory(cat.label === selectedCategory ? null : cat.label)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === cat.label ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-secondary"
            }`}
          >
            <span>{cat.emoji}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Scroll Rows */}
      <HorizontalScrollRow title="Recommended For You" icon={<Sparkles size={20} className="text-primary" />} items={recommendedItems} />
      <HorizontalScrollRow title="Trending Deals" icon={<TrendingUp size={20} className="text-orange-500" />} items={trendingItems} badge="HOT" variant="trending" />
      <HorizontalScrollRow title="Hot Deals" icon={<Zap size={20} className="text-red-500" />} items={hotDeals} badge="SAVE BIG" variant="hot" />

      {/* Full Grid */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen size={20} className="text-primary" />
          <h3 className="text-lg font-display font-bold text-foreground">
            {selectedCategory ? selectedCategory : "All Products & Services"}
          </h3>
          <span className="text-xs text-muted-foreground">({filteredItems.length} items)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredItems.map((item, i) => (
            <FeaturedItemCard key={item.id} item={item} index={i} onBuyNow={(it) => { setSelectedItem(it); setDrawerOpen(true); }} />
          ))}
        </div>
      </div>

      <CheckoutDrawer open={drawerOpen} onOpenChange={setDrawerOpen} item={selectedItem} />
    </div>
  );
};

export default Marketplace;
