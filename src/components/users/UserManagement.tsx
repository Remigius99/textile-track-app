
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Search, Edit, Trash2, UserCheck, UserX } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user";

interface UserManagementProps {
  user: User;
}

const UserManagement = ({ user }: UserManagementProps) => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    email: "",
    role: "business_owner" as const,
    businessName: "",
    location: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock users data - in real app this would come from database
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      role: "business_owner" as const,
      businessName: "Textile Store A",
      location: "Kariakoo",
      phone: "+255 123 456 789",
      isActive: true,
      createdAt: new Date()
    },
    {
      id: "2",
      name: "Jane Smith",
      username: "janesmith",
      email: "jane@example.com",
      role: "assistant" as const,
      businessName: "",
      location: "Dar es Salaam",
      phone: "+255 987 654 321",
      isActive: true,
      createdAt: new Date()
    }
  ]);

  const userRoles = ["admin", "business_owner", "assistant"];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async () => {
    if (!newUser.name.trim() || !newUser.username.trim() || !newUser.email.trim()) {
      console.log('Required fields are missing');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const userToAdd = {
        id: `user-${Date.now()}`,
        ...newUser,
        isActive: true,
        createdAt: new Date()
      };
      
      setUsers(prev => [userToAdd, ...prev]);
      setNewUser({
        name: "",
        username: "",
        email: "",
        role: "business_owner",
        businessName: "",
        location: "",
        phone: ""
      });
      setShowAddUser(false);
      console.log('User added successfully');
    } catch (error) {
      console.error('Failed to add user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-600/20 text-red-400";
      case "business_owner":
        return "bg-blue-600/20 text-blue-400";
      case "assistant":
        return "bg-green-600/20 text-green-400";
      default:
        return "bg-gray-600/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-4 p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-start md:space-y-0 md:gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">User Management</h2>
          <p className="text-xs sm:text-sm md:text-base text-blue-200 mt-1">
            Manage system users and their roles
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 md:space-x-3 flex-shrink-0">
          <div className="relative flex-1 sm:flex-none sm:w-48 md:w-56">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm h-9 md:h-10"
            />
          </div>
          <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 flex-shrink-0 h-9 md:h-10 text-sm md:text-base px-3 md:px-4">
                <Plus className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Add User</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 w-[95vw] max-w-md mx-auto my-4 max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white text-lg">Add New User</DialogTitle>
                <DialogDescription className="text-blue-200 text-sm">
                  Create a new user account
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="userName" className="text-white text-sm">Full Name *</Label>
                  <Input
                    id="userName"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="bg-white/10 border-white/20 text-white mt-1 h-9"
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="userUsername" className="text-white text-sm">Username *</Label>
                    <Input
                      id="userUsername"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      className="bg-white/10 border-white/20 text-white mt-1 h-9"
                      placeholder="e.g., johndoe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userRole" className="text-white text-sm">Role *</Label>
                    <Select value={newUser.role} onValueChange={(value: any) => setNewUser({...newUser, role: value})}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600 max-h-48">
                        {userRoles.map(role => (
                          <SelectItem key={role} value={role} className="text-white hover:bg-slate-700">
                            {role.replace('_', ' ').toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="userEmail" className="text-white text-sm">Email *</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="bg-white/10 border-white/20 text-white mt-1 h-9"
                    placeholder="e.g., john@example.com"
                  />
                </div>
                {newUser.role === "business_owner" && (
                  <div>
                    <Label htmlFor="businessName" className="text-white text-sm">Business Name</Label>
                    <Input
                      id="businessName"
                      value={newUser.businessName}
                      onChange={(e) => setNewUser({...newUser, businessName: e.target.value})}
                      className="bg-white/10 border-white/20 text-white mt-1 h-9"
                      placeholder="e.g., Textile Store"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="userLocation" className="text-white text-sm">Location</Label>
                    <Input
                      id="userLocation"
                      value={newUser.location}
                      onChange={(e) => setNewUser({...newUser, location: e.target.value})}
                      className="bg-white/10 border-white/20 text-white mt-1 h-9"
                      placeholder="e.g., Kariakoo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userPhone" className="text-white text-sm">Phone</Label>
                    <Input
                      id="userPhone"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      className="bg-white/10 border-white/20 text-white mt-1 h-9"
                      placeholder="+255 123 456 789"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddUser(false)}
                    disabled={isSubmitting}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-9 px-3 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddUser} 
                    className="bg-blue-600 hover:bg-blue-700 h-9 px-3 text-sm"
                    disabled={isSubmitting || !newUser.name.trim() || !newUser.username.trim() || !newUser.email.trim()}
                  >
                    {isSubmitting ? "Adding..." : "Add User"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4 sm:p-6 md:p-8 text-center">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white text-base sm:text-lg font-semibold mb-2">
              {searchTerm ? "No users found" : "No users yet"}
            </h3>
            <p className="text-blue-200 mb-4 text-sm md:text-base">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Start by adding your first user"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowAddUser(true)} className="bg-blue-600 hover:bg-blue-700 h-9 px-3 text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First User
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredUsers.map((userData) => (
            <Card key={userData.id} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-white text-sm sm:text-base md:text-lg line-clamp-1 flex-1 min-w-0">
                    {userData.name}
                  </CardTitle>
                  <div className="flex gap-1 flex-col">
                    <Badge 
                      className={`shrink-0 text-xs px-2 py-1 ${getRoleBadgeColor(userData.role)}`}
                    >
                      {userData.role.replace('_', ' ')}
                    </Badge>
                    <Badge 
                      variant={userData.isActive ? "default" : "destructive"} 
                      className="shrink-0 text-xs px-2 py-1"
                    >
                      {userData.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-blue-200 text-xs sm:text-sm line-clamp-1 mt-1">
                  @{userData.username}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-3 sm:p-4 pt-0">
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="min-w-0">
                    <span className="text-blue-300">Email:</span>
                    <p className="text-white line-clamp-1">{userData.email}</p>
                  </div>
                  {userData.businessName && (
                    <div className="min-w-0">
                      <span className="text-blue-300">Business:</span>
                      <p className="text-white line-clamp-1">{userData.businessName}</p>
                    </div>
                  )}
                  {userData.location && (
                    <div className="min-w-0">
                      <span className="text-blue-300">Location:</span>
                      <p className="text-white line-clamp-1">{userData.location}</p>
                    </div>
                  )}
                  {userData.phone && (
                    <div className="min-w-0">
                      <span className="text-blue-300">Phone:</span>
                      <p className="text-white line-clamp-1">{userData.phone}</p>
                    </div>
                  )}
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
                        userData.isActive 
                          ? "bg-yellow-600/20 border-yellow-400/20 text-yellow-400 hover:bg-yellow-600/30"
                          : "bg-green-600/20 border-green-400/20 text-green-400 hover:bg-green-600/30"
                      }`}
                      onClick={() => handleToggleUserStatus(userData.id)}
                    >
                      {userData.isActive ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
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
                        <AlertDialogTitle className="text-white">Delete User</AlertDialogTitle>
                        <AlertDialogDescription className="text-blue-200">
                          Are you sure you want to delete "{userData.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleRemoveUser(userData.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
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

export default UserManagement;
