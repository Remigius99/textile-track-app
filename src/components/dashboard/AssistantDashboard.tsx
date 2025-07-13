
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Product } from "@/types/user";
import { Package, Search, Activity, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AssistantDashboardProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AssistantDashboard = ({ user, activeTab, setActiveTab }: AssistantDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data for demonstration
  const [products] = useState<Product[]>([
    { id: "1", name: "Cotton Fabric", color: "Blue", category: "Fabrics", form: "Rolls", description: "High quality cotton", quantity: 150, storeId: "1", lastUpdated: new Date() },
    { id: "2", name: "Silk Thread", color: "Gold", category: "Threads", form: "Spools", description: "Premium silk thread", quantity: 200, storeId: "1", lastUpdated: new Date() },
    { id: "3", name: "Buttons", color: "White", category: "Accessories", form: "Packs", description: "Plastic buttons", quantity: 500, storeId: "2", lastUpdated: new Date() },
  ]);

  const recentActivities = [
    { id: "1", action: "Removed 5 units of Cotton Fabric", timestamp: new Date(Date.now() - 3600000) },
    { id: "2", action: "Checked inventory for Silk Thread", timestamp: new Date(Date.now() - 7200000) },
    { id: "3", action: "Updated Button stock count", timestamp: new Date(Date.now() - 10800000) },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveProduct = (productId: string, quantity: number) => {
    console.log(`Removing ${quantity} units from product ${productId}`);
    // In a real app, this would update the database
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Package className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-white font-medium">Available Products</p>
                <p className="text-2xl font-bold text-white">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Activity className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-white font-medium">Today's Actions</p>
                <p className="text-2xl font-bold text-white">{recentActivities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Eye className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-white font-medium">Access Level</p>
                <p className="text-lg font-bold text-white">View & Remove</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/10 border-white/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">Overview</TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-white/20">Products</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-white/20">My Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Welcome, {user.name}</CardTitle>
              <CardDescription className="text-blue-200">
                Your assistant dashboard for inventory management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-white">
                  As a store assistant, you can view product availability and remove items from inventory. 
                  All your actions are logged for transparency and accountability.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Your Permissions</h3>
                    <ul className="text-blue-200 text-sm space-y-1">
                      <li>• View product inventory</li>
                      <li>• Remove products from stock</li>
                      <li>• Search and filter products</li>
                      <li>• View activity logs (read-only)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Quick Stats</h3>
                    <ul className="text-blue-200 text-sm space-y-1">
                      <li>• {products.length} products available</li>
                      <li>• {recentActivities.length} actions today</li>
                      <li>• Access to {user.storeAccess?.length || 0} stores</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Product Inventory</CardTitle>
              <CardDescription className="text-blue-200">
                View and manage product availability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search products by name, category, or color..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="grid gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{product.name}</h3>
                        <div className="text-blue-200 text-sm space-y-1">
                          <p>Color: {product.color} | Category: {product.category}</p>
                          <p>Form: {product.form} | Quantity: {product.quantity}</p>
                          <p>{product.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          product.quantity > 100 ? 'bg-green-600 text-white' :
                          product.quantity > 50 ? 'bg-yellow-600 text-white' :
                          'bg-red-600 text-white'
                        }`}>
                          {product.quantity > 100 ? 'In Stock' :
                           product.quantity > 50 ? 'Low Stock' : 'Very Low'}
                        </span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveProduct(product.id, 1)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">My Activity Log</CardTitle>
              <CardDescription className="text-blue-200">
                View your recent actions and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white">{activity.action}</span>
                    <span className="text-blue-200 text-sm">
                      {activity.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssistantDashboard;
