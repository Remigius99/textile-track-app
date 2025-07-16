
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Store, Plus, Search, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStores } from "@/hooks/useStores";
import { User } from "@/types/user";

interface StoreManagementProps {
  user: User;
  onStoreSelect?: (storeId: string) => void;
}

const StoreManagement = ({ user, onStoreSelect }: StoreManagementProps) => {
  const { stores, loading, addStore } = useStores(user.id);
  const [showAddStore, setShowAddStore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newStore, setNewStore] = useState({
    name: "",
    location: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStore = async () => {
    if (!newStore.name.trim() || !newStore.location.trim()) {
      console.log('Store name or location is empty');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Submitting new store:', newStore);
      await addStore(newStore);
      setNewStore({ name: "", location: "", description: "" });
      setShowAddStore(false);
      console.log('Store added successfully');
    } catch (error) {
      console.error('Failed to add store:', error);
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading stores...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-start md:space-y-0 md:gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">Store Management</h2>
          <p className="text-xs sm:text-sm md:text-base text-blue-200 mt-1">Manage your textile stores and locations</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 md:space-x-3 flex-shrink-0">
          <div className="relative flex-1 sm:flex-none sm:w-48 md:w-56">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
            <Input
              placeholder="Search stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm h-9 md:h-10"
            />
          </div>
          <Dialog open={showAddStore} onOpenChange={setShowAddStore}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 flex-shrink-0 h-9 md:h-10 text-sm md:text-base px-3 md:px-4">
                <Plus className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Add Store</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 w-[95vw] max-w-md mx-auto my-8 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white text-lg">Add New Store</DialogTitle>
                <DialogDescription className="text-blue-200 text-sm">
                  Create a new store location for your business
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="storeName" className="text-white text-sm">Store Name *</Label>
                  <Input
                    id="storeName"
                    value={newStore.name}
                    onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                    className="bg-white/10 border-white/20 text-white mt-1 h-9"
                    placeholder="e.g., Store A - NMB Branch"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="storeLocation" className="text-white text-sm">Location *</Label>
                  <Input
                    id="storeLocation"
                    value={newStore.location}
                    onChange={(e) => setNewStore({...newStore, location: e.target.value})}
                    className="bg-white/10 border-white/20 text-white mt-1 h-9"
                    placeholder="e.g., Near NMB Bank, Kariakoo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="storeDescription" className="text-white text-sm">Description</Label>
                  <Textarea
                    id="storeDescription"
                    value={newStore.description}
                    onChange={(e) => setNewStore({...newStore, description: e.target.value})}
                    className="bg-white/10 border-white/20 text-white mt-1 text-sm resize-none"
                    placeholder="Brief description of the store"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddStore(false)}
                    disabled={isSubmitting}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-9 px-3 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddStore} 
                    className="bg-blue-600 hover:bg-blue-700 h-9 px-3 text-sm"
                    disabled={isSubmitting || !newStore.name.trim() || !newStore.location.trim()}
                  >
                    {isSubmitting ? "Adding..." : "Add Store"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredStores.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4 sm:p-6 md:p-8 text-center">
            <Store className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white text-base sm:text-lg font-semibold mb-2">
              {searchTerm ? "No stores found" : "No stores yet"}
            </h3>
            <p className="text-blue-200 mb-4 text-sm md:text-base">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Start by adding your first store location"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowAddStore(true)} className="bg-blue-600 hover:bg-blue-700 h-9 px-3 text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Store
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredStores.map((store) => (
            <Card 
              key={store.id} 
              className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
              onClick={() => onStoreSelect?.(store.id)}
            >
              <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
                <CardTitle className="text-white text-sm sm:text-base md:text-lg line-clamp-2 leading-tight">
                  {store.name}
                </CardTitle>
                <CardDescription className="text-blue-200 flex items-start text-xs sm:text-sm mt-1">
                  <MapPin className="w-3 h-3 mr-1 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-tight">{store.location}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                {store.description && (
                  <p className="text-white text-xs sm:text-sm line-clamp-3 mb-3 leading-relaxed">
                    {store.description}
                  </p>
                )}
                <div className="pt-2 sm:pt-3 border-t border-white/10">
                  <Button 
                    size="sm" 
                    className="w-full bg-blue-600 hover:bg-blue-700 h-8 sm:h-9 text-xs sm:text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStoreSelect?.(store.id);
                    }}
                  >
                    Manage Products
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

export default StoreManagement;
