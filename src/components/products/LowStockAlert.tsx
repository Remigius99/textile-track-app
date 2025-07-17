
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package, Plus } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useStores } from "@/hooks/useStores";
import { User, Product } from "@/types/user";

interface LowStockAlertProps {
  user: User;
  onProductSelect?: (productId: string) => void;
}

const LowStockAlert = ({ user, onProductSelect }: LowStockAlertProps) => {
  const { products } = useProducts(user.id);
  const { stores } = useStores(user.id);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Calculate low stock products (less than half of initial stock or less than 10)
    const lowStock = products.filter(product => {
      // If quantity is 0, it's definitely low stock
      if (product.quantity === 0) return true;
      
      // For products with quantity > 0, check if it's less than 50% of some threshold
      // We'll use a simple rule: if quantity < 10, it's low stock
      return product.quantity < 10;
    });

    setLowStockProducts(lowStock);
  }, [products]);

  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    return store ? store.name : "Unknown Store";
  };

  const getStockLevel = (quantity: number) => {
    if (quantity === 0) return { level: 'Out of Stock', variant: 'destructive' as const };
    if (quantity < 5) return { level: 'Critical', variant: 'destructive' as const };
    if (quantity < 10) return { level: 'Low', variant: 'secondary' as const };
    return { level: 'Normal', variant: 'default' as const };
  };

  if (lowStockProducts.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Package className="w-4 h-4 text-green-400" />
            Stock Levels
          </CardTitle>
          <CardDescription className="text-blue-200 text-sm">
            All products are well stocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-green-400 text-sm">✓ No items need restocking</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-base flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          Low Stock Alert
          <Badge variant="destructive" className="ml-auto">
            {lowStockProducts.length}
          </Badge>
        </CardTitle>
        <CardDescription className="text-blue-200 text-sm">
          Items that need restocking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {lowStockProducts.map((product) => {
          const stockInfo = getStockLevel(product.quantity);
          return (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-white text-sm font-medium truncate">
                    {product.name}
                  </h4>
                  <Badge variant={stockInfo.variant} className="text-xs">
                    {stockInfo.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-blue-200">
                  <span>Store: {getStoreName(product.storeId)}</span>
                  <span>Color: {product.color}</span>
                  <span>Category: {product.category}</span>
                </div>
                <div className="mt-1">
                  <span className="text-xs text-blue-300">
                    Current Stock: 
                    <span className={`ml-1 font-medium ${product.quantity === 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                      {product.quantity} {product.form}
                    </span>
                  </span>
                </div>
              </div>
              {onProductSelect && (
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-3 bg-blue-600/20 border-blue-400/20 text-blue-400 hover:bg-blue-600/30"
                  onClick={() => onProductSelect(product.id)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Restock
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default LowStockAlert;
