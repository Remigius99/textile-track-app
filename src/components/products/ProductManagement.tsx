
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Plus, Search, Edit, Minus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
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
    storeId: selectedStoreId || "",
    ownerId: user.id
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productForms = ["boxes", "pcs", "dozen", "bag", "rolls", "meters", "kg"];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.storeId) {
      console.log('Product name or store is missing');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Submitting new product:', newProduct);
      await addProduct(newProduct);
      setNewProduct({
        name: "",
        color: "",
        category: "",
        form: "boxes",
        description: "",
        quantity: 0,
        storeId: selectedStoreId || "",
        ownerId: user.id
      });
      setShowAddProduct(false);
      console.log('Product added successfully');
    } catch (error) {
      console.error('Failed to add product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = async (productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newQuantity = Math.max(0, product.quantity + change);
    try {
      console.log('Updating quantity for product:', productId, 'from', product.quantity, 'to', newQuantity);
      await updateProductQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    try {
      // Set quantity to 0 to effectively remove the product
      await updateProductQuantity(productId, 0);
      console.log('Product removed successfully');
    } catch (error) {
      console.error('Failed to remove product:', error);
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
    <div className="space-y-4 p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-start md:space-y-0 md:gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">Product Management</h2>
          {selectedStoreId && (
            <p className="text-xs sm:text-sm md:text-base text-blue-200 mt-1 truncate">
              Store: {getStoreName(selectedStoreId)}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 md:space-x-3 flex-shrink-0">
          <div className="relative flex-1 sm:flex-none sm:w-48 md:w-56">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm h-9 md:h-10"
            />
          </div>
          <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 flex-shrink-0 h-9 md:h-10 text-sm md:text-base px-3 md:px-4">
                <Plus className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 w-[95vw] max-w-md mx-auto my-4 max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white text-lg">Add New Product</DialogTitle>
                <DialogDescription className="text-blue-200 text-sm">
                  Add a new product to your inventory
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="productName" className="text-white text-sm">Product Name *</Label>
                  <Input
                    id="productName"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="bg-white/10 border-white/20 text-white mt-1 h-9"
                    placeholder="e.g., Silk Fabric"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="productColor" className="text-white text-sm">Color</Label>
                    <Input
                      id="productColor"
                      value={newProduct.color}
                      onChange={(e) => setNewProduct({...newProduct, color: e.target.value})}
                      className="bg-white/10 border-white/20 text-white mt-1 h-9"
                      placeholder="e.g., Black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productCategory" className="text-white text-sm">Category</Label>
                    <Input
                      id="productCategory"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="bg-white/10 border-white/20 text-white mt-1 h-9"
                      placeholder="e.g., Cotton"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="productForm" className="text-white text-sm">Form</Label>
                    <Select value={newProduct.form} onValueChange={(value: any) => setNewProduct({...newProduct, form: value})}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600 max-h-48">
                        {productForms.map(form => (
                          <SelectItem key={form} value={form} className="text-white hover:bg-slate-700">
                            {form.charAt(0).toUpperCase() + form.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="productQuantity" className="text-white text-sm">Quantity</Label>
                    <Input
                      id="productQuantity"
                      type="number"
                      min="0"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 0})}
                      className="bg-white/10 border-white/20 text-white mt-1 h-9"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="productStore" className="text-white text-sm">Store *</Label>
                  <Select value={newProduct.storeId} onValueChange={(value) => setNewProduct({...newProduct, storeId: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1 h-9">
                      <SelectValue placeholder="Select a store" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 max-h-48">
                      {stores.map(store => (
                        <SelectItem key={store.id} value={store.id} className="text-white hover:bg-slate-700">
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="productDescription" className="text-white text-sm">Description</Label>
                  <Textarea
                    id="productDescription"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="bg-white/10 border-white/20 text-white mt-1 text-sm resize-none"
                    placeholder="Product description"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddProduct(false)}
                    disabled={isSubmitting}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-9 px-3 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddProduct} 
                    className="bg-blue-600 hover:bg-blue-700 h-9 px-3 text-sm"
                    disabled={isSubmitting || !newProduct.name.trim() || !newProduct.storeId}
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
          <CardContent className="p-4 sm:p-6 md:p-8 text-center">
            <Package className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white text-base sm:text-lg font-semibold mb-2">
              {searchTerm ? "No products found" : "No products yet"}
            </h3>
            <p className="text-blue-200 mb-4 text-sm md:text-base">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Start by adding your first product to the inventory"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowAddProduct(true)} className="bg-blue-600 hover:bg-blue-700 h-9 px-3 text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-white text-sm sm:text-base md:text-lg line-clamp-1 flex-1 min-w-0">
                    {product.name}
                  </CardTitle>
                  <Badge 
                    variant={product.quantity > 0 ? "default" : "destructive"} 
                    className="shrink-0 text-xs px-2 py-1"
                  >
                    {product.quantity} {product.form}
                  </Badge>
                </div>
                {!selectedStoreId && (
                  <CardDescription className="text-blue-200 text-xs sm:text-sm line-clamp-1 mt-1">
                    {getStoreName(product.storeId)}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-3 p-3 sm:p-4 pt-0">
                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                  <div className="min-w-0">
                    <span className="text-blue-300">Color:</span>
                    <p className="text-white line-clamp-1">{product.color || "N/A"}</p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-blue-300">Category:</span>
                    <p className="text-white line-clamp-1">{product.category || "N/A"}</p>
                  </div>
                </div>
                {product.description && (
                  <div>
                    <span className="text-blue-300 text-xs sm:text-sm">Description:</span>
                    <p className="text-white text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-2">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-7 w-7 sm:h-8 sm:w-8 p-0"
                      onClick={() => handleQuantityChange(product.id, -1)}
                      disabled={product.quantity === 0}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-white font-medium min-w-[2rem] sm:min-w-[2.5rem] text-center text-xs sm:text-sm">
                      {product.quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-7 w-7 sm:h-8 sm:w-8 p-0"
                      onClick={() => handleQuantityChange(product.id, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-7 w-7 sm:h-8 sm:w-8 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-600/20 border-red-400/20 text-red-400 hover:bg-red-600/30 h-7 w-7 sm:h-8 sm:w-8 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-900 border-slate-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Remove Product</AlertDialogTitle>
                          <AlertDialogDescription className="text-blue-200">
                            Are you sure you want to remove "{product.name}"? This will set its quantity to 0.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleRemoveProduct(product.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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
