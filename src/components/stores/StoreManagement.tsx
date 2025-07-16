
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, Plus, MapPin, Edit, Package } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStores } from "@/hooks/useStores";
import { User } from "@/types/user";

interface StoreManagementProps {
  user: User;
  onViewInventory?: (storeId: string) => void;
}

const StoreManagement = ({ user, onViewInventory }: StoreManagementProps) => {
  const { stores, loading, addStore } = useStores(user.id);
  const [showAddStore, setShowAddStore] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    location: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Store Management</h2>
        <Dialog open={showAddStore} onOpenChange={setShowAddStore}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Store
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Store</DialogTitle>
              <DialogDescription className="text-blue-200">
                Create a new store or warehouse location
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="storeName" className="text-white">Store Name *</Label>
                <Input
                  id="storeName"
                  value={newStore.name}
                  onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="e.g., Store A at NMB Branch"
                  required
                />
              </div>
              <div>
                <Label htmlFor="storeLocation" className="text-white">Location *</Label>
                <Input
                  id="storeLocation"
                  value={newStore.location}
                  onChange={(e) => setNewStore({...newStore, location: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="e.g., Kariakoo, Dar es Salaam"
                  required
                />
              </div>
              <div>
                <Label htmlFor="storeDescription" className="text-white">Description</Label>
                <Textarea
                  id="storeDescription"
                  value={newStore.description}
                  onChange={(e) => setNewStore({...newStore, description: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Brief description of the store"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddStore(false)}
                  disabled={isSubmitting}
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

      {stores.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <Building className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No Stores Yet</h3>
            <p className="text-blue-200 mb-4">Start by adding your first store or warehouse location.</p>
            <Button onClick={() => setShowAddStore(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Store
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Card key={store.id} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-blue-400" />
                    <CardTitle className="text-white">{store.name}</CardTitle>
                  </div>
                  <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-blue-400 mt-1" />
                    <div>
                      <p className="text-white text-sm font-medium">Location</p>
                      <p className="text-blue-200 text-sm">{store.location}</p>
                    </div>
                  </div>
                  {store.description && (
                    <div>
                      <p className="text-white text-sm font-medium">Description</p>
                      <p className="text-blue-200 text-sm">{store.description}</p>
                    </div>
                  )}
                  <div className="pt-2 border-t border-white/10">
                    <Button 
                      size="sm" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => onViewInventory?.(store.id)}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      View Inventory
                    </Button>
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

export default StoreManagement;
