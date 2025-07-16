
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
    if (!newStore.name || !newStore.location) return;
    
    setIsSubmitting(true);
    try {
      await addStore(newStore);
      setNewStore({ name: "", location: "", description: "" });
      setShowAddStore(false);
    } catch (error) {
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
    <div className="space-y-4 p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Store Management</h2>
          <p className="text-sm md:text-base text-blue-200">Manage your textile stores and locations</p>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
            <Input
              placeholder="Search stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 w-full md:w-auto"
            />
          </div>
          <Dialog open={showAddStore} onOpenChange={setShowAddStore}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Store
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Store</DialogTitle>
                <DialogDescription className="text-blue-200">
                  Create a new store location for your business
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="storeName" className="text-white">Store Name *</Label>
                  <Input
                    id="storeName"
                    value={newStore.name}
                    onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                    className="bg-white/10 border-white/20 text-white mt-1"
                    placeholder="e.g., Store A - NMB Branch"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="storeLocation" className="text-white">Location *</Label>
                  <Input
                    id="storeLocation"
                    value={newStore.location}
                    onChange={(e) => setNewStore({...newStore, location: e.target.value})}
                    className="bg-white/10 border-white/20 text-white mt-1"
                    placeholder="e.g., Near NMB Bank, Kariakoo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="storeDescription" className="text-white">Description</Label>
                  <Textarea
                    id="storeDescription"
                    value={newStore.description}
                    onChange={(e) => setNewStore({...newStore, description: e.target.value})}
                    className="bg-white/10 border-white/20 text-white mt-1"
                    placeholder="Brief description of the store"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddStore(false)}
                    disabled={isSubmitting}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddStore} 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting || !newStore.name || !newStore.location}
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
          <CardContent className="p-6 md:p-8 text-center">
            <Store className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">
              {searchTerm ? "No stores found" : "No stores yet"}
            </h3>
            <p className="text-blue-200 mb-4 text-sm md:text-base">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Start by adding your first store location"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowAddStore(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Store
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredStores.map((store) => (
            <Card 
              key={store.id} 
              className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
              onClick={() => onStoreSelect?.(store.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base md:text-lg line-clamp-2">{store.name}</CardTitle>
                <CardDescription className="text-blue-200 flex items-center text-sm">
                  <MapPin className="w-3 h-3 mr-1 shrink-0" />
                  <span className="line-clamp-1">{store.location}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {store.description && (
                  <p className="text-white text-sm line-clamp-3">{store.description}</p>
                )}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <Button 
                    size="sm" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
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
