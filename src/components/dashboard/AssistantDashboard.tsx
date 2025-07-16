
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Activity, Search, Minus, Eye } from "lucide-react";
import { User } from "@/types/user";

interface AssistantDashboardProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AssistantDashboard = ({ user, activeTab, setActiveTab }: AssistantDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for demonstration - in real app, this would come from the database
  const [products] = useState([
    {
      id: "1",
      name: "Silk Fabric",
      color: "Black",
      category: "Cotton",
      form: "meters",
      quantity: 150,
      storeId: "store1",
      storeName: "Store A at NMB Branch"
    },
    {
      id: "2",
      name: "Canvas Material",
      color: "White",
      category: "Canvas",
      form: "boxes",
      quantity: 25,
      storeId: "store1",
      storeName: "Store A at NMB Branch"
    },
    {
      id: "3",
      name: "Tetron Fabric",
      color: "Blue",
      category: "Synthetic",
      form: "rolls",
      quantity: 75,
      storeId: "store2",
      storeName: "Store B at Msimbazi"
    }
  ]);

  const [activities] = useState([
    {
      id: "1",
      action: "Product removed",
      productName: "Silk Fabric",
      quantity: 10,
      timestamp: new Date(Date.now() - 3600000),
      storeName: "Store A at NMB Branch"
    },
    {
      id: "2",
      action: "Product removed",
      productName: "Canvas Material",
      quantity: 5,
      timestamp: new Date(Date.now() - 7200000),
      storeName: "Store A at NMB Branch"
    }
  ]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.storeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveProduct = (productId: string, quantity: number) => {
    console.log(`Removing ${quantity} of product ${productId}`);
    // In real implementation, this would update the database
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Available Products</CardTitle>
            <Package className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{products.length}</div>
            <p className="text-xs text-blue-200">Products you can manage</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Today's Activity</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {activities.filter(a => 
                new Date(a.timestamp).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <p className="text-xs text-blue-200">Actions performed today</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Access Status</CardTitle>
            <Eye className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">Active</div>
            <p className="text-xs text-blue-200">Full access granted</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-blue-600">
            Products
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-blue-600">
            My Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription className="text-blue-200">
                  Your latest actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between">
                      <div>
                        <span className="text-white">{activity.action}</span>
                        <p className="text-blue-200 text-sm">
                          {activity.productName} ({activity.quantity} units)
                        </p>
                      </div>
                      <span className="text-blue-200 text-sm">
                        {activity.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
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
                  onClick={() => setActiveTab("products")}
                  className="w-full text-left p-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-white transition-colors"
                >
                  <Package className="w-4 h-4 inline mr-2" />
                  View & Manage Products
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className="w-full text-left p-3 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-white transition-colors"
                >
                  <Activity className="w-4 h-4 inline mr-2" />
                  View My Activity Log
                </button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Available Products</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{product.name}</CardTitle>
                      <Badge variant={product.quantity > 10 ? "default" : "destructive"}>
                        {product.quantity} {product.form}
                      </Badge>
                    </div>
                    <CardDescription className="text-blue-200">
                      {product.storeName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-blue-300">Color:</span>
                        <p className="text-white">{product.color}</p>
                      </div>
                      <div>
                        <span className="text-blue-300">Category:</span>
                        <p className="text-white">{product.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-white font-medium">
                        Remove quantity:
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleRemoveProduct(product.id, 1)}
                          disabled={product.quantity === 0}
                        >
                          <Minus className="w-3 h-3 mr-1" />
                          Remove 1
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">My Activity Log</CardTitle>
              <CardDescription className="text-blue-200">
                View your daily, weekly, monthly, and yearly activities (Read-only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <Card key={activity.id} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-blue-300 border-blue-300">
                              {activity.action}
                            </Badge>
                          </div>
                          <p className="text-white font-medium">{activity.productName}</p>
                          <p className="text-blue-200 text-sm">
                            Quantity: {activity.quantity} units | Store: {activity.storeName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-blue-200 text-sm">
                            {activity.timestamp.toLocaleDateString()}
                          </p>
                          <p className="text-blue-300 text-xs">
                            {activity.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
