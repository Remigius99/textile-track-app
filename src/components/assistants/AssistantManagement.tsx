
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Search, UserCheck, UserX } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";

interface AssistantManagementProps {
  user: User;
}

const AssistantManagement = ({ user }: AssistantManagementProps) => {
  const [assistants, setAssistants] = useState([]);
  const [showAddAssistant, setShowAddAssistant] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newAssistant, setNewAssistant] = useState({
    name: "",
    username: "",
    email: "",
    phone: ""
  });

  const filteredAssistants = assistants.filter(assistant =>
    assistant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assistant.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAssistant = async () => {
    // TODO: Implement assistant creation with Supabase
    console.log("Adding assistant:", newAssistant);
    setShowAddAssistant(false);
    setNewAssistant({ name: "", username: "", email: "", phone: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Assistant Management</h2>
          <p className="text-blue-200">Manage your store assistants and their permissions</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
            <Input
              placeholder="Search assistants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <Dialog open={showAddAssistant} onOpenChange={setShowAddAssistant}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Assistant
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Assistant</DialogTitle>
                <DialogDescription className="text-blue-200">
                  Create a new assistant account for your business
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="assistantName" className="text-white">Full Name</Label>
                  <Input
                    id="assistantName"
                    value={newAssistant.name}
                    onChange={(e) => setNewAssistant({...newAssistant, name: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Assistant's full name"
                  />
                </div>
                <div>
                  <Label htmlFor="assistantUsername" className="text-white">Username</Label>
                  <Input
                    id="assistantUsername"
                    value={newAssistant.username}
                    onChange={(e) => setNewAssistant({...newAssistant, username: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Username for login"
                  />
                </div>
                <div>
                  <Label htmlFor="assistantEmail" className="text-white">Email</Label>
                  <Input
                    id="assistantEmail"
                    type="email"
                    value={newAssistant.email}
                    onChange={(e) => setNewAssistant({...newAssistant, email: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <Label htmlFor="assistantPhone" className="text-white">Phone</Label>
                  <Input
                    id="assistantPhone"
                    value={newAssistant.phone}
                    onChange={(e) => setNewAssistant({...newAssistant, phone: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Phone number"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddAssistant(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAssistant} className="bg-blue-600 hover:bg-blue-700">
                    Add Assistant
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredAssistants.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">
              {searchTerm ? "No assistants found" : "No assistants yet"}
            </h3>
            <p className="text-blue-200 mb-4">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Start by adding your first assistant to help manage your stores"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowAddAssistant(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Assistant
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssistants.map((assistant) => (
            <Card key={assistant.id} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">{assistant.name}</CardTitle>
                  <Badge variant={assistant.isActive ? "default" : "secondary"}>
                    {assistant.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription className="text-blue-200">
                  @{assistant.username}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <span className="text-blue-300">Email:</span>
                  <p className="text-white">{assistant.email}</p>
                </div>
                <div className="text-sm">
                  <span className="text-blue-300">Phone:</span>
                  <p className="text-white">{assistant.phone || "N/A"}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <Badge variant={assistant.isMuted ? "destructive" : "default"}>
                    {assistant.isMuted ? "Muted" : "Unmuted"}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white"
                    >
                      {assistant.isActive ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
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

export default AssistantManagement;
