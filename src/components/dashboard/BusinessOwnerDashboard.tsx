
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
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Stores</CardTitle>
            <Building className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stores.length}</div>
            <p className="text-xs text-blue-200">Active warehouses & stores</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalProducts}</div>
            <p className="text-xs text-blue-200">Items in inventory</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Product Types</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{products.length}</div>
            <p className="text-xs text-blue-200">Unique products</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Low Stock</CardTitle>
            <FileText className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{lowStockProducts}</div>
            <p className="text-xs text-blue-200">Items need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/10 border-white/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="stores" className="data-[state=active]:bg-blue-600">
            Stores
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-blue-600">
            Products
          </TabsTrigger>
          <TabsTrigger value="assistants" className="data-[state=active]:bg-blue-600">
            Assistants
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription className="text-blue-200">
                  Latest inventory movements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">System initialized</span>
                    <span className="text-blue-200 text-sm">Just now</span>
                  </div>
                  <div className="text-blue-200 text-sm">
                    Start managing your inventory by adding stores and products.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-blue-200">
                  Common tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  onClick={() => setActiveTab("stores")}
                  className="w-full text-left p-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-white transition-colors"
                >
                  <Building className="w-4 h-4 inline mr-2" />
                  Manage Stores
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className="w-full text-left p-3 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-white transition-colors"
                >
                  <Package className="w-4 h-4 inline mr-2" />
                  Manage Products
                </button>
                <button
                  onClick={() => setActiveTab("assistants")}
                  className="w-full text-left p-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-white transition-colors"
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Manage Assistants
                </button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stores">
          <StoreManagement user={user} onViewInventory={handleViewInventory} />
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
