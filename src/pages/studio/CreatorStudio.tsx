import { useState, useEffect, useRef, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Upload, Link2, Send, Save, Loader2, Eye, Download, Wrench, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PhonePreview from "@/components/studio/PhonePreview";
import HotspotEditor from "@/components/studio/HotspotEditor";
import PulseLibrary from "@/components/studio/PulseLibrary";

interface HotspotData {
  id: string;
  x: number;
  y: number;
  label: string;
  price: number;
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
  const [hotspots, setHotspots] = useState<HotspotData[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const phoneRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      const { data: store } = await supabase
        .from("sme_stores")
        .select("id, brand_name")
        .eq("owner_user_id", user.id)
        .maybeSingle();
      if (store) {
        setStoreId(store.id);
        setStoreName(store.brand_name || "My Store");
      }
    };
    init();
  }, [user]);

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
    setHotspots([]);
  }, []);

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("hive_media").upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed: " + error.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("hive_media").getPublicUrl(path);
    setUploadedUrl(urlData.publicUrl);
    toast.success("Media uploaded!");
    setUploading(false);
  };

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHotspots((prev) => [
      ...prev,
      { id: crypto.randomUUID(), x, y, label: title || "Product", price: Number(price) || 0 },
    ]);
  };

  const deleteHotspot = (id: string) => setHotspots((prev) => prev.filter((h) => h.id !== id));
  const updateHotspot = (id: string, field: "x" | "y", value: number) =>
    setHotspots((prev) => prev.map((h) => (h.id === id ? { ...h, [field]: Math.max(0, Math.min(100, value)) } : h)));

  const exportWrappedImage = async (): Promise<Blob | null> => {
    if (!wrapRef.current) return null;
    try {
      const dataUrl = await toPng(wrapRef.current, { cacheBust: true, pixelRatio: 2 });
      const res = await fetch(dataUrl);
      return await res.blob();
    } catch {
      toast.error("Failed to generate image.");
      return null;
    }
  };

  const handleBroadcast = async () => {
    const blob = await exportWrappedImage();
    if (!blob) return;

    const file = new File([blob], `hive-pulse-${Date.now()}.png`, { type: "image/png" });
    const url = `${window.location.origin}/store/${storeId}`;
    const text = `Check out ${title || "this product"} on The Hive! ${url}`;

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ title: "The Hive", text, files: [file] });
        return;
      } catch { /* user cancelled */ }
    }

    // Desktop fallback — download
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("Asset downloaded! Share it manually.");
  };

  const handlePublish = async (mode: "link" | "reel" | "whatsapp") => {
    if (!storeId) { toast.error("No store linked."); return; }
    if (!title.trim()) { toast.error("Title is required."); return; }
    setPublishing(true);

    const payload: Record<string, unknown> = {
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

    const { error } = await supabase.from("hive_catalogue").insert(payload as any);
    if (error) { toast.error(error.message); setPublishing(false); return; }

    if (mode === "whatsapp") {
      await handleBroadcast();
    }

    toast.success(mode === "reel" ? "Reel saved!" : mode === "whatsapp" ? "Broadcasted!" : "Pulse Link published!");
    setTitle(""); setPrice(""); setFile(null); setPreview(null); setUploadedUrl(null); setHotspots([]);
    setPublishing(false);
    setRefreshKey((k) => k + 1);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm";

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Creator Studio</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload media, tag products, generate Pulse Links & Reels</p>
        </div>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="bg-secondary/60 border border-border rounded-xl p-1 mb-6">
            <TabsTrigger value="edit" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm gap-1.5">
              <Wrench size={14} /> Edit Workspace
            </TabsTrigger>
            <TabsTrigger value="preview" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm gap-1.5">
              <Smartphone size={14} /> Live Preview
            </TabsTrigger>
          </TabsList>

          {/* ====== EDIT WORKSPACE ====== */}
          <TabsContent value="edit">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Upload & Controls */}
              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-card border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
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
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-semibold">
                    <Eye size={14} /> Media uploaded successfully
                  </div>
                )}

                <div className="space-y-3">
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product / Reel title *" className={inputClass} />
                  <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price in ZMW (optional)" type="number" className={inputClass} />
                </div>

                <HotspotEditor hotspots={hotspots} onDelete={deleteHotspot} onUpdate={updateHotspot} />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button onClick={() => handlePublish("link")} disabled={publishing} className="btn-gold py-3 text-xs flex items-center justify-center gap-2">
                    <Link2 size={14} /> Publish Pulse Link
                  </button>
                  <button onClick={() => handlePublish("whatsapp")} disabled={publishing}
                    className="py-3 text-xs flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors">
                    <Send size={14} /> Broadcast Media
                  </button>
                  <button onClick={() => handlePublish("reel")} disabled={publishing}
                    className="py-3 text-xs flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 text-foreground font-semibold hover:bg-secondary transition-colors">
                    <Save size={14} /> Save Reel
                  </button>
                </div>
              </div>

              {/* Right: Editable Phone Preview */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <p className="text-xs text-muted-foreground text-center mb-3">Click the screen to place hotspots</p>
                <PhonePreview
                  preview={preview}
                  mediaType={mediaType}
                  hotspots={hotspots}
                  title={title}
                  price={price}
                  storeName={storeName}
                  editable
                  onScreenClick={handleScreenClick}
                />
              </motion.div>
            </div>
          </TabsContent>

          {/* ====== LIVE PREVIEW ====== */}
          <TabsContent value="preview">
            <div className="flex flex-col items-center gap-6">
              <p className="text-xs text-muted-foreground">Final wrapped preview — hotspots are locked. Tap BUY NOW to simulate checkout.</p>
              <div ref={wrapRef}>
                <PhonePreview
                  preview={preview}
                  mediaType={mediaType}
                  hotspots={hotspots}
                  title={title}
                  price={price}
                  storeName={storeName}
                  editable={false}
                  onCtaClick={() => setShowCheckout(true)}
                  containerRef={phoneRef}
                />
              </div>

              <div className="flex gap-3">
                <button onClick={handleBroadcast} className="btn-gold py-2.5 px-5 text-xs flex items-center gap-2">
                  <Send size={14} /> Broadcast Wrapped Asset
                </button>
                <button onClick={async () => {
                  const blob = await exportWrappedImage();
                  if (!blob) return;
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = `hive-pulse-${Date.now()}.png`;
                  a.click();
                  URL.revokeObjectURL(a.href);
                  toast.success("Downloaded!");
                }} className="py-2.5 px-5 text-xs flex items-center gap-2 rounded-xl border border-border bg-secondary/50 text-foreground font-semibold hover:bg-secondary transition-colors">
                  <Download size={14} /> Download Asset
                </button>
              </div>

              {/* Simulated checkout drawer */}
              {showCheckout && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="w-[280px] bg-card border border-border rounded-t-2xl p-5 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-foreground">🛒 Checkout</h3>
                    <button onClick={() => setShowCheckout(false)} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
                  </div>
                  <p className="text-xs text-muted-foreground">{title || "Product"}</p>
                  <p className="text-lg font-bold text-primary mt-1">ZMW {price || "0"}</p>
                  <button className="btn-gold w-full py-2.5 mt-4 text-xs">🔒 LOCK DEAL</button>
                </motion.div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* ====== PULSE LINKS LIBRARY ====== */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-display font-bold text-foreground">Your Generated Pulse Links</h2>
          </div>
          <PulseLibrary storeId={storeId} refreshKey={refreshKey} />
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default CreatorStudio;
