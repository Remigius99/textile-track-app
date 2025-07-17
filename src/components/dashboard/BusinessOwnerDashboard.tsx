
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Package, Users, BarChart3, FileText, AlertTriangle, History } from "lucide-react";
import StoreManagement from "@/components/stores/StoreManagement";
import ProductManagement from "@/components/products/ProductManagement";
import AssistantManagement from "@/components/assistants/AssistantManagement";
import ActivityHistory from "@/components/activities/ActivityHistory";
import LowStockAlert from "@/components/products/LowStockAlert";
import { User } from "@/types/user";
import { useStores } from "@/hooks/useStores";
import { useProducts } from "@/hooks/useProducts";

interface BusinessOwnerDashboardProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BusinessOwnerDashboard = ({ user, activeTab, setActiveTab }: BusinessOwnerDashboardProps) => {
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>();
  const { stores, loading: storesLoading } = useStores(user.id);
  const { products, loading: productsLoading } = useProducts(user.id);

  // Calculate dynamic metrics - ensure we have data before calculating
  const totalProducts = productsLoading ? 0 : products.reduce((sum, product) => sum + product.quantity, 0);
  const lowStockProducts = productsLoading ? 0 : products.filter(product => product.quantity < 10).length;
  const outOfStockProducts = productsLoading ? 0 : products.filter(product => product.quantity === 0).length;
  const uniqueProductTypes = productsLoading ? 0 : products.length;
  const activeStores = storesLoading ? 0 : stores.filter(store => store.isActive).length;
  const totalStores = storesLoading ? 0 : stores.length;

  const handleViewInventory = (storeId: string) => {
    setSelectedStoreId(storeId);
    setActiveTab("products");
  };

  const handleCardClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleProductSelect = (productId: string) => {
    setActiveTab("products");
    // You could implement scrolling to specific product here
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card 
          className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
          onClick={() => handleCardClick("stores")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-white">Active Stores</CardTitle>
            <Building className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
              {storesLoading ? "..." : activeStores}
            </div>
            <p className="text-xs text-blue-200">
              of {storesLoading ? "..." : totalStores} total stores
            </p>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
          onClick={() => handleCardClick("products")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-white">Total Items</CardTitle>
            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
              {productsLoading ? "..." : totalProducts}
            </div>
            <p className="text-xs text-blue-200">
              {productsLoading ? "..." : uniqueProductTypes} product types
            </p>
          </CardContent>
        </Card>

        <Card 
          className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
          onClick={() => handleCardClick("products")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-white">Low Stock</CardTitle>
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
              {productsLoading ? "..." : lowStockProducts}
            </div>
            <p className="text-xs text-blue-200">
              {productsLoading ? "..." : outOfStockProducts} out of stock
            </p>
          </CardContent>
        </Card>

        <Card 
          className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
          onClick={() => handleCardClick("assistants")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-white">Assistants</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
              {/* This will be updated when we implement assistant fetching */}
              0
            </div>
            <p className="text-xs text-blue-200">Click to manage</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/10 border-white/20 h-9 sm:h-10">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="stores" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
            Stores ({storesLoading ? "..." : totalStores})
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
            Products ({productsLoading ? "..." : uniqueProductTypes})
          </TabsTrigger>
          <TabsTrigger value="assistants" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
            Assistants (0)
          </TabsTrigger>
          <TabsTrigger value="activities" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
            Activities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Low Stock Alert */}
            <LowStockAlert user={user} onProductSelect={handleProductSelect} />

            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="text-white text-base sm:text-lg">Quick Actions</CardTitle>
                <CardDescription className="text-blue-200 text-sm">
                  Common tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-3 sm:p-4 md:p-6 pt-0">
                <button
                  onClick={() => setActiveTab("stores")}
                  className="w-full text-left p-2 sm:p-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-white transition-colors text-sm"
                >
                  <Building className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                  Manage Stores
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className="w-full text-left p-2 sm:p-3 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-white transition-colors text-sm"
                >
                  <Package className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                  Manage Products
                </button>
                <button
                  onClick={() => setActiveTab("assistants")}
                  className="w-full text-left p-2 sm:p-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-white transition-colors text-sm"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                  Manage Assistants
                </button>
                <button
                  onClick={() => setActiveTab("activities")}
                  className="w-full text-left p-2 sm:p-3 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-white transition-colors text-sm"
                >
                  <History className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                  View Activity History
                </button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stores">
          <StoreManagement user={user} onStoreSelect={handleViewInventory} />
        </TabsContent>

        <TabsContent value="products">
          <ProductManagement user={user} selectedStoreId={selectedStoreId} />
        </TabsContent>

        <TabsContent value="assistants">
          <AssistantManagement user={user} />
        </TabsContent>

        <TabsContent value="activities">
          <ActivityHistory user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessOwnerDashboard;
