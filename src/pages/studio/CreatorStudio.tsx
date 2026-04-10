import { useState, useEffect, useRef, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Video, Upload, Image, Move, Link2, Copy, Send, Save, X, Loader2, Eye, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface HotspotData {
  x: number;
  y: number;
  label: string;
  price: number;
}

interface PulseLink {
  id: number;
  product_name: string | null;
  image_url: string | null;
  digital_vault: string | null;
  created_at: string;
  category: string | null;
}

const CreatorStudio = () => {
  const { user } = useAuth();
  const [storeId, setStoreId] = useState<number | null>(null);
  const [storeName, setStoreName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [hotspot, setHotspot] = useState<HotspotData | null>(null);
  const [links, setLinks] = useState<PulseLink[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const phoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      const { data: store } = await supabase.from("sme_stores").select("id, brand_name").eq("owner_user_id", user.id).maybeSingle();
      if (store) {
        setStoreId(store.id);
        setStoreName(store.brand_name || "My Store");
      }
      fetchLinks(store?.id || null);
    };
    init();
  }, [user]);

  const fetchLinks = async (sid: number | null) => {
    if (!sid) { setLoadingLinks(false); return; }
    setLoadingLinks(true);
    const { data } = await supabase
      .from("hive_catalogue")
      .select("id, product_name, image_url, digital_vault, created_at, category")
      .eq("sme_id", sid)
      .order("created_at", { ascending: false })
      .limit(50);
    setLinks((data as PulseLink[]) || []);
    setLoadingLinks(false);
  };

  const handleFileDrop = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const isVideo = f.type.startsWith("video/");
    const isImage = f.type.startsWith("image/");
    if (!isVideo && !isImage) { toast.error("Only .png, .jpg, or .mp4 files allowed."); return; }
    if (f.size > 50 * 1024 * 1024) { toast.error("Max file size is 50MB."); return; }
    setFile(f);
    setMediaType(isVideo ? "video" : "image");
    setPreview(URL.createObjectURL(f));
    setUploadedUrl(null);
    setHotspot(null);
  }, []);

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("hive_media").upload(path, file, { upsert: true });
    if (error) {
      toast.error("Upload failed: " + error.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("hive_media").getPublicUrl(path);
    setUploadedUrl(urlData.publicUrl);
    toast.success("Media uploaded!");
    setUploading(false);
  };

  const handlePhoneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!phoneRef.current) return;
    const rect = phoneRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHotspot({ x, y, label: title || "Product", price: Number(price) || 0 });
  };

  const handlePublish = async (mode: "link" | "reel" | "whatsapp") => {
    if (!storeId) { toast.error("No store linked."); return; }
    if (!title.trim()) { toast.error("Title is required."); return; }
    setPublishing(true);

    const payload: any = {
      product_name: title.trim(),
      sme_id: storeId,
      item_type: "product",
      category: "Entertainment",
      price: Number(price) || 0,
      stock_count: 999,
    };

    if (uploadedUrl) {
      if (mediaType === "video") payload.digital_vault = uploadedUrl;
      else payload.image_url = uploadedUrl;
    }

    const { error } = await supabase.from("hive_catalogue").insert(payload);
    if (error) { toast.error(error.message); setPublishing(false); return; }

    if (mode === "whatsapp") {
      const storeUrl = `${window.location.origin}/store/${storeId}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${title} on The Hive! ${storeUrl}`)}`, "_blank");
    }

    toast.success(mode === "reel" ? "Reel saved!" : mode === "whatsapp" ? "Broadcasted!" : "Pulse Link published!");
    setTitle(""); setPrice(""); setFile(null); setPreview(null); setUploadedUrl(null); setHotspot(null);
    setPublishing(false);
    fetchLinks(storeId);
  };

  const copyLink = (id: number) => {
    navigator.clipboard.writeText(`${window.location.origin}/store/${storeId}?item=${id}`);
    toast.success("Link copied!");
  };

  const deleteLink = async (id: number) => {
    const { error } = await supabase.from("hive_catalogue").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted."); fetchLinks(storeId); }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm";

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Creator Studio</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload media, tag products, generate Pulse Links & Reels</p>
        </div>

        {/* Main workspace — split screen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Upload & Controls */}
          <div className="space-y-5">
            {/* Dropzone */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() => fileInputRef.current?.click()}>
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,video/mp4" onChange={handleFileDrop} className="hidden" />
              <Upload size={40} className="mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-sm font-semibold text-foreground">Drop or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">.PNG, .JPG, or .MP4 — up to 50MB</p>
            </motion.div>

            {file && !uploadedUrl && (
              <button onClick={handleUpload} disabled={uploading} className="btn-gold w-full py-3 text-sm flex items-center justify-center gap-2">
                {uploading ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : <><Upload size={16} /> Upload to Hive Media</>}
              </button>
            )}

            {uploadedUrl && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <Eye size={14} /> Media uploaded successfully
              </div>
            )}

            {/* Metadata */}
            <div className="space-y-3">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Product / Reel title *" className={inputClass} />
              <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price in ZMW (optional)" type="number" className={inputClass} />
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Move size={10} /> Click on the phone preview to place a product hotspot
              </p>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button onClick={() => handlePublish("link")} disabled={publishing}
                className="btn-gold py-3 text-xs flex items-center justify-center gap-2">
                <Link2 size={14} /> Publish Pulse Link
              </button>
              <button onClick={() => handlePublish("whatsapp")} disabled={publishing}
                className="py-3 text-xs flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors">
                <Send size={14} /> Broadcast WhatsApp
              </button>
              <button onClick={() => handlePublish("reel")} disabled={publishing}
                className="py-3 text-xs flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 text-foreground font-semibold hover:bg-secondary transition-colors">
                <Save size={14} /> Save Reel
              </button>
            </div>
          </div>

          {/* RIGHT: Phone Preview */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex items-center justify-center">
            <div className="relative w-[280px]">
              {/* Phone frame */}
              <div className="border-[6px] border-foreground/80 rounded-[2.5rem] overflow-hidden shadow-2xl bg-background">
                {/* Notch */}
                <div className="h-6 bg-foreground/80 flex items-center justify-center">
                  <div className="w-20 h-3 bg-foreground rounded-full" />
                </div>
                {/* Screen */}
                <div ref={phoneRef} onClick={handlePhoneClick}
                  className="aspect-[9/16] bg-secondary/30 relative cursor-crosshair overflow-hidden">
                  {preview ? (
                    mediaType === "video" ? (
                      <video src={preview} className="w-full h-full object-cover" muted autoPlay loop />
                    ) : (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40">
                      <Image size={48} />
                      <p className="text-xs mt-2">Upload media to preview</p>
                    </div>
                  )}

                  {/* Hotspot */}
                  {hotspot && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute z-10" style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: "translate(-50%, -50%)" }}>
                      <div className="bg-primary text-primary-foreground px-2 py-1 rounded-lg text-[9px] font-bold whitespace-nowrap shadow-lg">
                        🏷️ {hotspot.label}
                      </div>
                    </motion.div>
                  )}

                  {/* Hive Overlay */}
                  {preview && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent p-4">
                      <p className="text-xs font-bold text-background truncate">{title || "Product Title"}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-primary font-bold text-sm">ZMW {price || "0"}</span>
                        <span className="text-[9px] text-background/70">{storeName}</span>
                      </div>
                      <button className="w-full mt-2 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold">
                        🛒 BUY NOW
                      </button>
                    </div>
                  )}
                </div>
                {/* Home bar */}
                <div className="h-5 bg-foreground/80 flex items-center justify-center">
                  <div className="w-24 h-1 bg-background/30 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Link Management Table */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-display font-bold text-foreground">Pulse Links & Reels</h2>
            <span className="text-xs text-muted-foreground">{links.length} items</span>
          </div>

          {loadingLinks ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
            </div>
          ) : links.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              <Video size={32} className="mx-auto mb-2 opacity-30" />
              No published content yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Title</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
                    <th className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link, i) => (
                    <motion.tr key={link.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-border/30 last:border-0 hover:bg-secondary/20">
                      <td className="px-5 py-4 text-sm font-medium text-foreground">{link.product_name || "Untitled"}</td>
                      <td className="px-5 py-4 text-xs text-muted-foreground hidden sm:table-cell">
                        {link.digital_vault ? (
                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">Reel</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">Link</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground hidden md:table-cell">
                        {new Date(link.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => copyLink(link.id)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground" title="Copy link">
                            <Copy size={14} />
                          </button>
                          <button onClick={() => deleteLink(link.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default CreatorStudio;
