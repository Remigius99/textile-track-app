
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Plus, Search, Edit, Trash2, UserCheck, UserX, Volume2, VolumeX } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user";
import { useStores } from "@/hooks/useStores";

interface AssistantManagementProps {
  user: User;
}

const AssistantManagement = ({ user }: AssistantManagementProps) => {
  const { stores } = useStores(user.id);
  const [showAddAssistant, setShowAddAssistant] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newAssistant, setNewAssistant] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    storeAccess: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock assistants data - in real app this would come from database
  const [assistants, setAssistants] = useState([
    {
      id: "1",
      assistantId: "user-1",
      businessOwnerId: user.id,
      name: "Alice Johnson",
      username: "alice",
      email: "alice@example.com",
      phone: "+255 111 222 333",
      storeAccess: ["demo-store-1"],
      isActive: true,
      isMuted: false,
      createdAt: new Date()
    },
    {
      id: "2",
      assistantId: "user-2",
      businessOwnerId: user.id,
      name: "Bob Wilson",
      username: "bob",
      email: "bob@example.com",
      phone: "+255 444 555 666",
      storeAccess: ["demo-store-1", "demo-store-2"],
      isActive: true,
      isMuted: true,
      createdAt: new Date()
    }
  ]);

  const filteredAssistants = assistants.filter(assistant =>
    assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assistant.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assistant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAssistant = async () => {
    if (!newAssistant.name.trim() || !newAssistant.username.trim() || !newAssistant.email.trim()) {
      console.log('Required fields are missing');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const assistantToAdd = {
        id: `assistant-${Date.now()}`,
        assistantId: `user-${Date.now()}`,
        businessOwnerId: user.id,
        ...newAssistant,
        isActive: true,
        isMuted: false,
        createdAt: new Date()
      };
      
      setAssistants(prev => [assistantToAdd, ...prev]);
      setNewAssistant({
        name: "",
        username: "",
        email: "",
        phone: "",
        storeAccess: []
      });
      setShowAddAssistant(false);
      console.log('Assistant added successfully');
    } catch (error) {
      console.error('Failed to add assistant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAssistantStatus = (assistantId: string) => {
    setAssistants(prev => prev.map(assistant =>
      assistant.id === assistantId ? { ...assistant, isActive: !assistant.isActive } : assistant
    ));
  };

  const handleToggleMute = (assistantId: string) => {
    setAssistants(prev => prev.map(assistant =>
      assistant.id === assistantId ? { ...assistant, isMuted: !assistant.isMuted } : assistant
    ));
  };

  const handleRemoveAssistant = (assistantId: string) => {
    setAssistants(prev => prev.filter(assistant => assistant.id !== assistantId));
  };

  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    return store ? store.name : storeId;
  };

  const handleStoreAccessChange = (storeId: string, checked: boolean) => {
    setNewAssistant(prev => ({
      ...prev,
      storeAccess: checked
        ? [...prev.storeAccess, storeId]
        : prev.storeAccess.filter(id => id !== storeId)
    }));
  };

  return (
    <div className="space-y-4 p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-start md:space-y-0 md:gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">Assistant Management</h2>
          <p className="text-xs sm:text-sm md:text-base text-blue-200 mt-1">
            Manage your store assistants and their access
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 md:space-x-3 flex-shrink-0">
          <div className="relative flex-1 sm:flex-none sm:w-48 md:w-56">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
            <Input
              placeholder="Search assistants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm h-9 md:h-10"
            />
          </div>
          <Dialog open={showAddAssistant} onOpenChange={setShowAddAssistant}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 flex-shrink-0 h-9 md:h-10 text-sm md:text-base px-3 md:px-4">
                <Plus className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Add Assistant</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 w-[95vw] max-w-md mx-auto my-4 max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white text-lg">Add New Assistant</DialogTitle>
                <DialogDescription className="text-blue-200 text-sm">
                  Create a new assistant account
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="assistantName" className="text-white text-sm">Full Name *</Label>
                  <Input
                    id="assistantName"
                    value={newAssistant.name}
                    onChange={(e) => setNewAssistant({...newAssistant, name: e.target.value})}
                    className="bg-white/10 border-white/20 text-white mt-1 h-9"
                    placeholder="e.g., Alice Johnson"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="assistantUsername" className="text-white text-sm">Username *</Label>
                    <Input
                      id="assistantUsername"
                      value={newAssistant.username}
                      onChange={(e) => setNewAssistant({...newAssistant, username: e.target.value})}
                      className="bg-white/10 border-white/20 text-white mt-1 h-9"
                      placeholder="e.g., alice"
                    />
                  </div>
                  <div>
                    <Label htmlFor="assistantPhone" className="text-white text-sm">Phone</Label>
                    <Input
                      id="assistantPhone"
                      value={newAssistant.phone}
                      onChange={(e) => setNewAssistant({...newAssistant, phone: e.target.value})}
                      className="bg-white/10 border-white/20 text-white mt-1 h-9"
                      placeholder="+255 123 456 789"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="assistantEmail" className="text-white text-sm">Email *</Label>
                  <Input
                    id="assistantEmail"
                    type="email"
                    value={newAssistant.email}
                    onChange={(e) => setNewAssistant({...newAssistant, email: e.target.value})}
                    className="bg-white/10 border-white/20 text-white mt-1 h-9"
                    placeholder="e.g., alice@example.com"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Store Access</Label>
                  <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                    {stores.map(store => (
                      <div key={store.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`store-${store.id}`}
                          checked={newAssistant.storeAccess.includes(store.id)}
                          onCheckedChange={(checked) => handleStoreAccessChange(store.id, checked as boolean)}
                          className="border-white/20"
                        />
                        <Label htmlFor={`store-${store.id}`} className="text-white text-sm flex-1 cursor-pointer">
                          {store.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {stores.length === 0 && (
                    <p className="text-blue-200 text-sm mt-2">No stores available. Create stores first.</p>
                  )}
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddAssistant(false)}
                    disabled={isSubmitting}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-9 px-3 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddAssistant} 
                    className="bg-blue-600 hover:bg-blue-700 h-9 px-3 text-sm"
                    disabled={isSubmitting || !newAssistant.name.trim() || !newAssistant.username.trim() || !newAssistant.email.trim()}
                  >
                    {isSubmitting ? "Adding..." : "Add Assistant"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredAssistants.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4 sm:p-6 md:p-8 text-center">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white text-base sm:text-lg font-semibold mb-2">
              {searchTerm ? "No assistants found" : "No assistants yet"}
            </h3>
            <p className="text-blue-200 mb-4 text-sm md:text-base">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Start by adding your first assistant"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowAddAssistant(true)} className="bg-blue-600 hover:bg-blue-700 h-9 px-3 text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Assistant
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredAssistants.map((assistant) => (
            <Card key={assistant.id} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-white text-sm sm:text-base md:text-lg line-clamp-1 flex-1 min-w-0">
                    {assistant.name}
                  </CardTitle>
                  <div className="flex gap-1 flex-col">
                    <Badge 
                      variant={assistant.isActive ? "default" : "destructive"} 
                      className="shrink-0 text-xs px-2 py-1"
                    >
                      {assistant.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {assistant.isMuted && (
                      <Badge 
                        className="shrink-0 text-xs px-2 py-1 bg-yellow-600/20 text-yellow-400"
                      >
                        Muted
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription className="text-blue-200 text-xs sm:text-sm line-clamp-1 mt-1">
                  @{assistant.username}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-3 sm:p-4 pt-0">
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="min-w-0">
                    <span className="text-blue-300">Email:</span>
                    <p className="text-white line-clamp-1">{assistant.email}</p>
                  </div>
                  {assistant.phone && (
                    <div className="min-w-0">
                      <span className="text-blue-300">Phone:</span>
                      <p className="text-white line-clamp-1">{assistant.phone}</p>
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="text-blue-300">Store Access:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {assistant.storeAccess.length > 0 ? (
                        assistant.storeAccess.map(storeId => (
                          <Badge key={storeId} className="text-xs bg-blue-600/20 text-blue-400">
                            {getStoreName(storeId)}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-white text-xs">No store access</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-2">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-7 w-7 sm:h-8 sm:w-8 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-7 w-7 sm:h-8 sm:w-8 p-0 ${
                        assistant.isActive 
                          ? "bg-yellow-600/20 border-yellow-400/20 text-yellow-400 hover:bg-yellow-600/30"
                          : "bg-green-600/20 border-green-400/20 text-green-400 hover:bg-green-600/30"
                      }`}
                      onClick={() => handleToggleAssistantStatus(assistant.id)}
                    >
                      {assistant.isActive ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-7 w-7 sm:h-8 sm:w-8 p-0 ${
                        assistant.isMuted 
                          ? "bg-orange-600/20 border-orange-400/20 text-orange-400 hover:bg-orange-600/30"
                          : "bg-gray-600/20 border-gray-400/20 text-gray-400 hover:bg-gray-600/30"
                      }`}
                      onClick={() => handleToggleMute(assistant.id)}
                    >
                      {assistant.isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </Button>
                  </div>
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
                        <AlertDialogTitle className="text-white">Remove Assistant</AlertDialogTitle>
                        <AlertDialogDescription className="text-blue-200">
                          Are you sure you want to remove "{assistant.name}" as an assistant? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleRemoveAssistant(assistant.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssistantManagement;
