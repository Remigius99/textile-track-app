
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Store, Product } from "@/types/user";
import { Building, Package, Users, TrendingUp, Plus, FileText } from "lucide-react";
import StoreManagement from "@/components/stores/StoreManagement";
import ProductManagement from "@/components/products/ProductManagement";
import AssistantManagement from "@/components/assistants/AssistantManagement";

interface BusinessOwnerDashboardProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BusinessOwnerDashboard = ({ user, activeTab, setActiveTab }: BusinessOwnerDashboardProps) => {
  // Mock data for demonstration
  const [stores] = useState<Store[]>([
    { id: "1", name: "Kariakoo Main Store", location: "Kariakoo, Dar es Salaam", description: "Main retail location", ownerId: user.id },
    { id: "2", name: "Warehouse A", location: "Industrial Area", description: "Primary storage facility", ownerId: user.id },
    { id: "3", name: "Warehouse B", location: "Temeke", description: "Secondary storage", ownerId: user.id },
  ]);

  const [products] = useState<Product[]>([
    { id: "1", name: "Cotton Fabric", color: "Blue", category: "Fabrics", form: "Rolls", description: "High quality cotton", quantity: 150, storeId: "1", lastUpdated: new Date() },
    { id: "2", name: "Silk Thread", color: "Gold", category: "Threads", form: "Spools", description: "Premium silk thread", quantity: 200, storeId: "1", lastUpdated: new Date() },
    { id: "3", name: "Buttons", color: "White", category: "Accessories", form: "Packs", description: "Plastic buttons", quantity: 500, storeId: "2", lastUpdated: new Date() },
  ]);

  const dashboardStats = {
    totalStores: stores.length,
    totalProducts: products.reduce((sum, product) => sum + product.quantity, 0),
    lowStockItems: products.filter(p => p.quantity < 50).length,
    activeAssistants: 3
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Building className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-white font-medium">Total Stores</p>
                <p className="text-2xl font-bold text-white">{dashboardStats.totalStores}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Package className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-white font-medium">Total Products</p>
                <p className="text-2xl font-bold text-white">{dashboardStats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <TrendingUp className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-white font-medium">Low Stock Items</p>
                <p className="text-2xl font-bold text-white">{dashboardStats.lowStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-white font-medium">Active Assistants</p>
                <p className="text-2xl font-bold text-white">{dashboardStats.activeAssistants}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/10 border-white/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">Overview</TabsTrigger>
          <TabsTrigger value="stores" className="data-[state=active]:bg-white/20">Stores</TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-white/20">Products</TabsTrigger>
          <TabsTrigger value="assistants" className="data-[state=active]:bg-white/20">Assistants</TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-white/20">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Cotton Fabric restocked</span>
                    <span className="text-gray-400">2 hours ago</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">New assistant added</span>
                    <span className="text-gray-400">1 day ago</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Warehouse B inventory updated</span>
                    <span className="text-gray-400">2 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
                <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                  <Building className="w-4 h-4 mr-2" />
                  Add New Store
                </Button>
                <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stores">
          <StoreManagement stores={stores} />
        </TabsContent>

        <TabsContent value="products">
          <ProductManagement products={products} stores={stores} />
        </TabsContent>

        <TabsContent value="assistants">
          <AssistantManagement />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Reports & Analytics</CardTitle>
              <CardDescription className="text-blue-200">
                Generate and view business reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-20 flex-col space-y-2 bg-blue-600 hover:bg-blue-700">
                  <FileText className="w-6 h-6" />
                  <span>Inventory Report</span>
                </Button>
                <Button className="h-20 flex-col space-y-2 bg-green-600 hover:bg-green-700">
                  <TrendingUp className="w-6 h-6" />
                  <span>Sales Analytics</span>
                </Button>
                <Button className="h-20 flex-col space-y-2 bg-purple-600 hover:bg-purple-700">
                  <Users className="w-6 h-6" />
                  <span>Staff Performance</span>
                </Button>
                <Button className="h-20 flex-col space-y-2 bg-yellow-600 hover:bg-yellow-700">
                  <Building className="w-6 h-6" />
                  <span>Store Summary</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessOwnerDashboard;
