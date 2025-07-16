
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Plus, Search, Edit, Minus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useProducts } from "@/hooks/useProducts";
import { useStores } from "@/hooks/useStores";
import { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";

interface ProductManagementProps {
  user: User;
  selectedStoreId?: string;
}

const ProductManagement = ({ user, selectedStoreId }: ProductManagementProps) => {
  const { stores } = useStores(user.id);
  const { products, loading, addProduct, updateProductQuantity } = useProducts(user.id, selectedStoreId);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    color: "",
    category: "",
    form: "boxes" as const,
    description: "",
    quantity: 0,
    storeId: selectedStoreId || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productForms = ["boxes", "pcs", "dozen", "bag", "rolls", "meters", "kg"];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.storeId) return;
    
    setIsSubmitting(true);
    try {
      await addProduct(newProduct);
      setNewProduct({
        name: "",
        color: "",
        category: "",
        form: "boxes",
        description: "",
        quantity: 0,
        storeId: selectedStoreId || ""
      });
      setShowAddProduct(false);
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = async (productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newQuantity = Math.max(0, product.quantity + change);
    try {
      await updateProductQuantity(productId, newQuantity);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    return store ? store.name : "Unknown Store";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Product Management</h2>
          {selectedStoreId && (
            <p className="text-blue-200">Store: {getStoreName(selectedStoreId)}</p>
          )}
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Product</DialogTitle>
                <DialogDescription className="text-blue-200">
                  Add a new product to your inventory
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="productName" className="text-white">Product Name *</Label>
                  <Input
                    id="productName"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="e.g., Silk"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="productColor" className="text-white">Color</Label>
                    <Input
                      id="productColor"
                      value={newProduct.color}
                      onChange={(e) => setNewProduct({...newProduct, color: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="e.g., Black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productCategory" className="text-white">Category</Label>
                    <Input
                      id="productCategory"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="e.g., Cotton"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="productForm" className="text-white">Form</Label>
                    <Select value={newProduct.form} onValueChange={(value: any) => setNewProduct({...newProduct, form: value})}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {productForms.map(form => (
                          <SelectItem key={form} value={form}>
                            {form.charAt(0).toUpperCase() + form.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="productQuantity" className="text-white">Quantity</Label>
                    <Input
                      id="productQuantity"
                      type="number"
                      min="0"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 0})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="productStore" className="text-white">Store *</Label>
                  <Select value={newProduct.storeId} onValueChange={(value) => setNewProduct({...newProduct, storeId: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select a store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map(store => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="productDescription" className="text-white">Description</Label>
                  <Textarea
                    id="productDescription"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Product description"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddProduct(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddProduct} 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting || !newProduct.name || !newProduct.storeId}
                  >
                    {isSubmitting ? "Adding..." : "Add Product"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">
              {searchTerm ? "No products found" : "No products yet"}
            </h3>
            <p className="text-blue-200 mb-4">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Start by adding your first product to the inventory"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowAddProduct(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">{product.name}</CardTitle>
                  <Badge variant={product.quantity > 0 ? "default" : "destructive"}>
                    {product.quantity} {product.form}
                  </Badge>
                </div>
                {!selectedStoreId && (
                  <CardDescription className="text-blue-200">
                    {getStoreName(product.storeId)}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-blue-300">Color:</span>
                    <p className="text-white">{product.color || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-blue-300">Category:</span>
                    <p className="text-white">{product.category || "N/A"}</p>
                  </div>
                </div>
                {product.description && (
                  <div>
                    <span className="text-blue-300 text-sm">Description:</span>
                    <p className="text-white text-sm">{product.description}</p>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => handleQuantityChange(product.id, -1)}
                      disabled={product.quantity === 0}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-white font-medium min-w-[3rem] text-center">
                      {product.quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => handleQuantityChange(product.id, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
