import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import RetailerStudioDashboard from "./pages/RetailerStudioDashboard.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Warehouse from "./pages/Warehouse.tsx";
import GigRadar from "./pages/GigRadar.tsx";
import CustomerDashboard from "./pages/CustomerDashboard.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import StorePage from "./pages/StorePage.tsx";
import NotFound from "./pages/NotFound.tsx";
import PulseReels from "./pages/studio/PulseReels.tsx";
import ProductLinks from "./pages/studio/ProductLinks.tsx";
import Products from "./pages/studio/Products.tsx";
import Services from "./pages/studio/Services.tsx";
import Orders from "./pages/studio/Orders.tsx";
import PulseCredits from "./pages/studio/PulseCredits.tsx";
import WholesaleBountyHub from "./pages/studio/WholesaleBountyHub.tsx";
import OnlineStorefront from "./pages/studio/OnlineStorefront.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/store/:smeId" element={<StorePage />} />
            <Route path="/category/:name" element={<CategoryPage />} />

            {/* Customer */}
            <Route path="/customer-dash" element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            } />

            {/* Vendor / SME */}
            <Route path="/retailer-studio" element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <RetailerStudioDashboard />
              </ProtectedRoute>
            } />
            <Route path="/studio" element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <RetailerStudioDashboard />
              </ProtectedRoute>
            } />
            <Route path="/retailer-studio/reels" element={<ProtectedRoute allowedRoles={["vendor"]}><PulseReels /></ProtectedRoute>} />
            <Route path="/retailer-studio/links" element={<ProtectedRoute allowedRoles={["vendor"]}><ProductLinks /></ProtectedRoute>} />
            <Route path="/retailer-studio/products" element={<ProtectedRoute allowedRoles={["vendor"]}><Products /></ProtectedRoute>} />
            <Route path="/retailer-studio/services" element={<ProtectedRoute allowedRoles={["vendor"]}><Services /></ProtectedRoute>} />
            <Route path="/retailer-studio/orders" element={<ProtectedRoute allowedRoles={["vendor"]}><Orders /></ProtectedRoute>} />
            <Route path="/retailer-studio/credits" element={<ProtectedRoute allowedRoles={["vendor"]}><PulseCredits /></ProtectedRoute>} />
            <Route path="/retailer-studio/wholesale" element={<ProtectedRoute allowedRoles={["vendor"]}><WholesaleBountyHub /></ProtectedRoute>} />
            <Route path="/retailer-studio/storefront" element={<ProtectedRoute allowedRoles={["vendor"]}><OnlineStorefront /></ProtectedRoute>} />

            {/* Wholesaler */}
            <Route path="/warehouse" element={
              <ProtectedRoute allowedRoles={["wholesaler"]}>
                <Warehouse />
              </ProtectedRoute>
            } />

            {/* Gig Worker */}
            <Route path="/gig-radar" element={
              <ProtectedRoute allowedRoles={["gig_worker"]}>
                <GigRadar />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
