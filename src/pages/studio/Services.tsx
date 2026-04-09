import DashboardLayout from "@/components/DashboardLayout";
import { Briefcase, Plus, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const mockServices = [
  { id: 1, name: "Hair Braiding", price: 200, duration: "2 hrs", location: "In-store", bookings: 18, status: "active" },
  { id: 2, name: "Tailoring & Alterations", price: 150, duration: "3 days", location: "In-store", bookings: 7, status: "active" },
  { id: 3, name: "Makeup Session", price: 500, duration: "1.5 hrs", location: "Mobile", bookings: 12, status: "active" },
];

const Services = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Services</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your service offerings and bookings</p>
        </div>
        <button className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm">
          <Plus size={16} /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockServices.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase size={18} className="text-primary" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Active</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{service.name}</h3>
              <p className="text-lg font-bold text-foreground mt-1">ZMW {service.price}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock size={12} /> {service.duration}</span>
              <span className="flex items-center gap-1"><MapPin size={12} /> {service.location}</span>
            </div>
            <div className="pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground">{service.bookings} bookings this month</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default Services;
