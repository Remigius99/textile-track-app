
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Store } from "@/types/user";
import { Building, Plus, MapPin, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface StoreManagementProps {
  stores: Store[];
}

const StoreManagement = ({ stores }: StoreManagementProps) => {
  const [showAddStore, setShowAddStore] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    location: "",
    description: ""
  });

  const handleAddStore = () => {
    console.log("Adding new store:", newStore);
    // In a real app, this would save to database
    setNewStore({ name: "", location: "", description: "" });
    setShowAddStore(false);
  };

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
                <Label htmlFor="storeName" className="text-white">Store Name</Label>
                <Input
                  id="storeName"
                  value={newStore.name}
                  onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Enter store name"
                />
              </div>
              <div>
                <Label htmlFor="storeLocation" className="text-white">Location</Label>
                <Input
                  id="storeLocation"
                  value={newStore.location}
                  onChange={(e) => setNewStore({...newStore, location: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Enter location address"
                />
              </div>
              <div>
                <Label htmlFor="storeDescription" className="text-white">Description</Label>
                <Textarea
                  id="storeDescription"
                  value={newStore.description}
                  onChange={(e) => setNewStore({...newStore, description: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Enter store description"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddStore(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStore} className="bg-blue-600 hover:bg-blue-700">
                  Add Store
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
                <div>
                  <p className="text-white text-sm font-medium">Description</p>
                  <p className="text-blue-200 text-sm">{store.description}</p>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    View Inventory
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StoreManagement;
