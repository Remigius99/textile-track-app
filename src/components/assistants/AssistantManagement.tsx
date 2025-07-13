
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Users, Plus, UserCheck, UserX, Activity } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Assistant {
  id: string;
  name: string;
  username: string;
  isActive: boolean;
  storeAccess: string[];
  totalActions: number;
  lastActivity: Date;
}

const AssistantManagement = () => {
  const [showAddAssistant, setShowAddAssistant] = useState(false);
  const [assistants, setAssistants] = useState<Assistant[]>([
    {
      id: "1",
      name: "John Mwamba",
      username: "john_assistant",
      isActive: true,
      storeAccess: ["1", "2"],
      totalActions: 45,
      lastActivity: new Date(Date.now() - 3600000)
    },
    {
      id: "2",
      name: "Mary Kimaro",
      username: "mary_assistant",
      isActive: true,
      storeAccess: ["1", "3"],
      totalActions: 32,
      lastActivity: new Date(Date.now() - 7200000)
    },
    {
      id: "3",
      name: "Peter Mollel",
      username: "peter_assistant",
      isActive: false,
      storeAccess: ["2"],
      totalActions: 12,
      lastActivity: new Date(Date.now() - 86400000)
    }
  ]);

  const [newAssistant, setNewAssistant] = useState({
    name: "",
    username: "",
    password: "",
    storeAccess: [] as string[]
  });

  const handleAddAssistant = () => {
    const assistant: Assistant = {
      id: Date.now().toString(),
      name: newAssistant.name,
      username: newAssistant.username,
      isActive: true,
      storeAccess: newAssistant.storeAccess,
      totalActions: 0,
      lastActivity: new Date()
    };
    
    setAssistants([...assistants, assistant]);
    setNewAssistant({ name: "", username: "", password: "", storeAccess: [] });
    setShowAddAssistant(false);
    console.log("Added new assistant:", assistant);
  };

  const toggleAssistantStatus = (assistantId: string) => {
    setAssistants(assistants.map(assistant => 
      assistant.id === assistantId 
        ? { ...assistant, isActive: !assistant.isActive }
        : assistant
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Assistant Management</h2>
        <Dialog open={showAddAssistant} onOpenChange={setShowAddAssistant}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Assistant
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Assistant</DialogTitle>
              <DialogDescription className="text-blue-200">
                Create a new assistant account with store access
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
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="assistantUsername" className="text-white">Username</Label>
                <Input
                  id="assistantUsername"
                  value={newAssistant.username}
                  onChange={(e) => setNewAssistant({...newAssistant, username: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="assistantPassword" className="text-white">Password</Label>
                <Input
                  id="assistantPassword"
                  type="password"
                  value={newAssistant.password}
                  onChange={(e) => setNewAssistant({...newAssistant, password: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Enter password"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assistants.map((assistant) => (
          <Card key={assistant.id} className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <CardTitle className="text-white">{assistant.name}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  {assistant.isActive ? (
                    <UserCheck className="w-5 h-5 text-green-400" />
                  ) : (
                    <UserX className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </div>
              <CardDescription className="text-blue-200">
                @{assistant.username}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">Status</span>
                  <span className={assistant.isActive ? "text-green-400" : "text-red-400"}>
                    {assistant.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">Total Actions</span>
                  <span className="text-white">{assistant.totalActions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">Store Access</span>
                  <span className="text-white">{assistant.storeAccess.length} stores</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">Last Activity</span>
                  <span className="text-white text-xs">
                    {assistant.lastActivity.toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-sm text-blue-200">
                  {assistant.isActive ? "Mute Assistant" : "Unmute Assistant"}
                </span>
                <Switch 
                  checked={assistant.isActive}
                  onCheckedChange={() => toggleAssistantStatus(assistant.id)}
                />
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1 bg-white/10 border-white/20 text-white">
                  <Activity className="w-4 h-4 mr-1" />
                  View Activity
                </Button>
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Assistant Performance Summary</CardTitle>
          <CardDescription className="text-blue-200">
            Overview of assistant activity and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{assistants.filter(a => a.isActive).length}</p>
              <p className="text-blue-200 text-sm">Active Assistants</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {assistants.reduce((sum, a) => sum + a.totalActions, 0)}
              </p>
              <p className="text-blue-200 text-sm">Total Actions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {Math.round(assistants.reduce((sum, a) => sum + a.totalActions, 0) / assistants.length)}
              </p>
              <p className="text-blue-200 text-sm">Avg Actions per Assistant</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssistantManagement;
