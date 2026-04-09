import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, Heart, Star, Truck, Package, Search, Shirt, Smartphone, Music, UtensilsCrossed, Sparkles } from "lucide-react";
import CheckoutDrawer from "./CheckoutDrawer";

const categories = [
  { label: "All", icon: Package },
  { label: "Fashion", icon: Shirt },
  { label: "Tech", icon: Smartphone },
  { label: "Entertainment", icon: Music },
  { label: "Food", icon: UtensilsCrossed },
  { label: "Beauty", icon: Sparkles },
];

const now = new Date().toISOString();
const demoItems = [
  { id: 1, item_name: "African Print Blazer", price: 450, old_price: 600, image_url: null, store_name: "Lusaka Threads", category: "Fashion", created_at: now, is_featured: true, discount_percent: 25, rating: 4.6, review_count: 145, in_stock: true, fast_delivery: true, free_shipping: true },
  { id: 2, item_name: "Wireless Earbuds Pro", price: 280, old_price: 350, image_url: null, store_name: "TechZone Zambia", category: "Tech", created_at: now, is_featured: false, discount_percent: 15, rating: 4.8, review_count: 312, in_stock: true, fast_delivery: true, free_shipping: false },
  { id: 3, item_name: "Shea Butter Collection", price: 120, old_price: 180, image_url: null, store_name: "Glow Africa", category: "Beauty", created_at: now, is_featured: true, discount_percent: 30, rating: 4.3, review_count: 89, in_stock: true, fast_delivery: false, free_shipping: true },
  { id: 4, item_name: "Handwoven Basket Bag", price: 320, old_price: null, image_url: null, store_name: "Craft & Culture", category: "Fashion", created_at: now, is_featured: false, discount_percent: 0, rating: 4.9, review_count: 67, in_stock: true, fast_delivery: true, free_shipping: false },
  { id: 5, item_name: "Organic Honey Set", price: 95, old_price: 130, image_url: null, store_name: "Harvest Hub", category: "Food", created_at: now, is_featured: true, discount_percent: 20, rating: 4.5, review_count: 203, in_stock: true, fast_delivery: true, free_shipping: true },
  { id: 6, item_name: "Solar Power Bank", price: 210, old_price: 280, image_url: null, store_name: "TechZone Zambia", category: "Tech", created_at: now, is_featured: false, discount_percent: 25, rating: 4.2, review_count: 156, in_stock: true, fast_delivery: false, free_shipping: false },
  { id: 7, item_name: "Ankara Sneakers", price: 380, old_price: 500, image_url: null, store_name: "Lusaka Threads", category: "Fashion", created_at: now, is_featured: true, discount_percent: 24, rating: 4.7, review_count: 98, in_stock: false, fast_delivery: true, free_shipping: true },
  { id: 8, item_name: "Natural Hair Oil", price: 75, old_price: 100, image_url: null, store_name: "Glow Africa", category: "Beauty", created_at: now, is_featured: false, discount_percent: 25, rating: 4.4, review_count: 178, in_stock: true, fast_delivery: true, free_shipping: false },
];

function store_initial(name: string) {
  return name[0];
}

const ShoppingGrid = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredItems = demoItems.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = !searchQuery || item.item_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBuyNow = (item: any) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  return (
    <section id="marketplace" className="relative z-10 px-4 py-8 max-w-6xl mx-auto">
      <h3 className="text-2xl font-display font-bold text-foreground mb-6 text-center">
        Featured <span className="text-primary">Marketplace</span>
      </h3>

      <div className="max-w-xl mx-auto mb-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
          />
        </motion.div>
      </div>

      <div className="flex justify-center gap-2 flex-wrap mb-8">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(cat.label)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
              activeCategory === cat.label
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary/40"
            }`}
          >
            <cat.icon size={14} />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredItems.map((item, i) => {
          const savings = item.old_price ? Math.round(((item.old_price - item.price) / item.old_price) * 100) : 0;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.04 * i }}
              className="bg-card rounded-xl overflow-hidden flex flex-col border border-border hover:border-primary/40 transition-colors shadow-sm"
            >
              <div className="relative h-44 bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl">🛍️</span>
                </div>
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {item.is_featured && (
                    <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Sparkles size={10} /> Featured
                    </span>
                  )}
                  {item.fast_delivery && (
                    <span className="bg-emerald-600 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Truck size={10} /> Fast Delivery
                    </span>
                  )}
                  {savings > 0 && (
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-md">-{savings}% OFF</span>
                  )}
                </div>
                <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center border border-border hover:bg-destructive/10 transition-colors">
                  <Heart size={16} className="text-muted-foreground hover:text-destructive" />
                </button>
                {item.rating > 0 && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-foreground/70 backdrop-blur-sm text-primary-foreground text-[11px] font-bold px-2 py-0.5 rounded-md">
                    <Star size={11} className="fill-yellow-400 text-yellow-400" />
                    {item.rating} ({item.review_count})
                  </div>
                )}
              </div>

              <div className="p-3 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                    {store_initial(item.store_name)}
                  </span>
                  <span className="text-xs text-muted-foreground truncate flex-1">{item.store_name}</span>
                  <BadgeCheck size={14} className="text-blue-500 shrink-0" />
                </div>
                <p className="text-sm font-semibold text-foreground line-clamp-2 mb-2 flex-1">{item.item_name}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-primary font-bold text-base">ZMW {item.price}</span>
                  {item.old_price && <span className="text-xs text-muted-foreground line-through">ZMW {item.old_price}</span>}
                </div>
                {savings > 0 && <p className="text-emerald-600 text-[11px] font-semibold mb-2">Save {savings}%</p>}
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground mb-3">
                  <span className={item.in_stock ? "text-emerald-600" : "text-destructive"}>● {item.in_stock ? "In Stock" : "Out of Stock"}</span>
                  {item.fast_delivery && <span className="flex items-center gap-0.5"><Truck size={10} />Fast</span>}
                  {item.free_shipping && <span className="flex items-center gap-0.5"><Package size={10} />Free Ship</span>}
                </div>
                <button onClick={() => handleBuyNow(item)} className="btn-gold w-full flex items-center justify-center gap-1.5 text-xs py-2.5 px-3 rounded-lg">
                  🛒 Buy Now
                </button>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button onClick={() => navigate(`/store/1`)} className="flex items-center justify-center gap-1 text-[11px] font-semibold text-primary border border-primary/30 rounded-lg py-1.5 hover:bg-primary/5 transition-colors">
                    <Package size={12} /> Store
                  </button>
                  <button className="flex items-center justify-center gap-1 text-[11px] font-semibold text-muted-foreground border border-border rounded-lg py-1.5 hover:bg-secondary transition-colors">
                    Details
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <CheckoutDrawer open={drawerOpen} onOpenChange={setDrawerOpen} item={selectedItem} />
    </section>
  );
};

export default ShoppingGrid;
