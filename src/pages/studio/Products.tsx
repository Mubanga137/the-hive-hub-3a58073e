import DashboardLayout from "@/components/DashboardLayout";
import { Package, Plus } from "lucide-react";
import { motion } from "framer-motion";

const mockProducts = [
  { id: 1, name: "Ankara Print Dress", price: 350, stock: 24, category: "Fashion", status: "active" },
  { id: 2, name: "Handmade Leather Bag", price: 580, stock: 8, category: "Accessories", status: "active" },
  { id: 3, name: "Organic Shea Butter", price: 95, stock: 0, category: "Beauty", status: "out_of_stock" },
  { id: 4, name: "Chitenge Headwrap Set", price: 120, stock: 45, category: "Fashion", status: "active" },
];

const Products = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your product inventory</p>
        </div>
        <button className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden group"
          >
            <div className="aspect-square bg-secondary/30 flex items-center justify-center">
              <Package size={36} className="text-muted-foreground/30" />
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-sm text-foreground truncate">{product.name}</h3>
              <p className="text-xs text-muted-foreground">{product.category}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">ZMW {product.price}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  product.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                }`}>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default Products;
