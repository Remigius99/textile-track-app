
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Package, Users, BarChart3, FileText } from "lucide-react";
import StoreManagement from "@/components/stores/StoreManagement";
import ProductManagement from "@/components/products/ProductManagement";
import AssistantManagement from "@/components/assistants/AssistantManagement";
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
  const { stores } = useStores(user.id);
  const { products } = useProducts(user.id);

  const totalProducts = products.reduce((sum, product) => sum + product.quantity, 0);
  const lowStockProducts = products.filter(product => product.quantity < 10).length;

  const handleViewInventory = (storeId: string) => {
    setSelectedStoreId(storeId);
    setActiveTab("products");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-white">Total Stores</CardTitle>
            <Building className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{stores.length}</div>
            <p className="text-xs text-blue-200">Active warehouses & stores</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-white">Total Products</CardTitle>
            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{totalProducts}</div>
            <p className="text-xs text-blue-200">Items in inventory</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-white">Product Types</CardTitle>
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{products.length}</div>
            <p className="text-xs text-blue-200">Unique products</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-white">Low Stock</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{lowStockProducts}</div>
            <p className="text-xs text-blue-200">Items need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/10 border-white/20 h-9 sm:h-10">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="stores" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
            Stores
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
            Products
          </TabsTrigger>
          <TabsTrigger value="assistants" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
            Assistants
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="text-white text-base sm:text-lg">Recent Activity</CardTitle>
                <CardDescription className="text-blue-200 text-sm">
                  Latest inventory movements
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">System initialized</span>
                    <span className="text-blue-200 text-xs">Just now</span>
                  </div>
                  <div className="text-blue-200 text-xs sm:text-sm">
                    Start managing your inventory by adding stores and products.
                  </div>
                </div>
              </CardContent>
            </Card>

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
      </Tabs>
    </div>
  );
};

export default BusinessOwnerDashboard;
