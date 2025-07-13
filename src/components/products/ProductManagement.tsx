
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, Store } from "@/types/user";
import { Package, Plus, Search, Edit, TrendingUp, TrendingDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ProductManagementProps {
  products: Product[];
  stores: Store[];
}

const ProductManagement = ({ products, stores }: ProductManagementProps) => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState("all");
  const [newProduct, setNewProduct] = useState({
    name: "",
    color: "",
    category: "",
    form: "",
    description: "",
    quantity: 0,
    storeId: ""
  });

  const categories = ["Fabrics", "Threads", "Accessories", "Tools", "Patterns"];
  const forms = ["Rolls", "Spools", "Packs", "Pieces", "Sets"];
  const colors = ["Red", "Blue", "Green", "Yellow", "Black", "White", "Gold", "Silver"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.color.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStore = selectedStore === "all" || product.storeId === selectedStore;
    return matchesSearch && matchesStore;
  });

  const handleAddProduct = () => {
    console.log("Adding new product:", newProduct);
    // In a real app, this would save to database
    setNewProduct({
      name: "",
      color: "",
      category: "",
      form: "",
      description: "",
      quantity: 0,
      storeId: ""
    });
    setShowAddProduct(false);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity > 100) return { status: "In Stock", color: "bg-green-600", icon: TrendingUp };
    if (quantity > 50) return { status: "Low Stock", color: "bg-yellow-600", icon: TrendingDown };
    return { status: "Very Low", color: "bg-red-600", icon: TrendingDown };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Product Management</h2>
        <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Product</DialogTitle>
              <DialogDescription className="text-blue-200">
                Register a new product in your inventory
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productName" className="text-white">Product Name</Label>
                <Input
                  id="productName"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="productColor" className="text-white">Color</Label>
                <Select value={newProduct.color} onValueChange={(value) => setNewProduct({...newProduct, color: value})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color} value={color}>{color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="productCategory" className="text-white">Category</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="productForm" className="text-white">Form</Label>
                <Select value={newProduct.form} onValueChange={(value) => setNewProduct({...newProduct, form: value})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select form" />
                  </SelectTrigger>
                  <SelectContent>
                    {forms.map((form) => (
                      <SelectItem key={form} value={form}>{form}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="productQuantity" className="text-white">Quantity</Label>
                <Input
                  id="productQuantity"
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 0})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <Label htmlFor="productStore" className="text-white">Store</Label>
                <Select value={newProduct.storeId} onValueChange={(value) => setNewProduct({...newProduct, storeId: value})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="productDescription" className="text-white">Description</Label>
                <Input
                  id="productDescription"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Enter product description"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddProduct(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700">
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Product Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Filter by store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredProducts.map((product) => {
          const stockInfo = getStockStatus(product.quantity);
          const StatusIcon = stockInfo.icon;
          const store = stores.find(s => s.id === product.storeId);
          
          return (
            <Card key={product.id} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Package className="w-8 h-8 text-blue-400" />
                    <div>
                      <h3 className="text-white font-medium text-lg">{product.name}</h3>
                      <div className="text-blue-200 text-sm space-y-1">
                        <p>Color: {product.color} | Category: {product.category} | Form: {product.form}</p>
                        <p>Store: {store?.name} | Description: {product.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-white">{product.quantity}</span>
                      <StatusIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className={`px-2 py-1 rounded text-xs text-white ${stockInfo.color}`}>
                      {stockInfo.status}
                    </span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Restock
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProductManagement;
