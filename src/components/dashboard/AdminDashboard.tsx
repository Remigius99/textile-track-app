
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Building, Package, CheckCircle, XCircle, Clock } from "lucide-react";

interface AdminDashboardProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminDashboard = ({ user, activeTab, setActiveTab }: AdminDashboardProps) => {
  // Mock data for demonstration - in real app, this would come from actual database queries
  const [businessRegistrations] = useState([
    {
      id: "1",
      businessName: "Mubusi Textile Ltd",
      ownerName: "John Mubusi",
      email: "john@mubusi.com",
      phone: "+255 123 456 789",
      location: "Kariakoo, Dar es Salaam",
      status: "pending",
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      businessName: "Kariakoo Fabrics",
      ownerName: "Mary Johnson",
      email: "mary@kariakoo.com",
      phone: "+255 987 654 321",
      location: "Kariakoo, Dar es Salaam",
      status: "approved",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  const pendingRegistrations = businessRegistrations.filter(reg => reg.status === "pending");
  const approvedBusinesses = businessRegistrations.filter(reg => reg.status === "approved");
  const totalUsers = 26; // This would come from actual database query
  const activeBusinessOwners = 24; // This would come from actual database query

  const handleApproveRegistration = (id: string) => {
    console.log("Approving registration:", id);
    // In real implementation, this would update the database
  };

  const handleRejectRegistration = (id: string) => {
    console.log("Rejecting registration:", id);
    // In real implementation, this would update the database
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-green-600/20 text-green-400"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-red-600/20 text-red-400"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalUsers}</div>
            <p className="text-xs text-blue-200">{activeBusinessOwners} active business owners</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{pendingRegistrations.length}</div>
            <p className="text-xs text-blue-200">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Businesses</CardTitle>
            <Building className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{approvedBusinesses.length}</div>
            <p className="text-xs text-blue-200">Approved & active</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">100%</div>
            <p className="text-xs text-blue-200">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="registrations" className="data-[state=active]:bg-blue-600">
            Registrations ({pendingRegistrations.length})
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
            Users ({totalUsers})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription className="text-blue-200">
                  Latest system activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">New business registration</span>
                    <span className="text-blue-200 text-sm">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">User approved: Mary Johnson</span>
                    <span className="text-blue-200 text-sm">1 day ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">System backup completed</span>
                    <span className="text-blue-200 text-sm">1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-blue-200">
                  Administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  onClick={() => setActiveTab("registrations")}
                  className="w-full text-left p-3 rounded-lg bg-yellow-600/20 hover:bg-yellow-600/30 text-white transition-colors"
                >
                  <Clock className="w-4 h-4 inline mr-2" />
                  Review Pending Registrations ({pendingRegistrations.length})
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className="w-full text-left p-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-white transition-colors"
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Manage Users
                </button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="registrations">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Business Registrations</CardTitle>
              <CardDescription className="text-blue-200">
                Review and approve new business applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessRegistrations.map((registration) => (
                  <Card key={registration.id} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-white font-semibold">{registration.businessName}</h3>
                            {getStatusBadge(registration.status)}
                          </div>
                          <p className="text-blue-200">Owner: {registration.ownerName}</p>
                          <p className="text-blue-200 text-sm">Email: {registration.email}</p>
                          <p className="text-blue-200 text-sm">Location: {registration.location}</p>
                          <p className="text-blue-300 text-xs">
                            Applied: {new Date(registration.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {registration.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveRegistration(registration.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectRegistration(registration.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">User Management</CardTitle>
              <CardDescription className="text-blue-200">
                Manage all system users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">User Management</h3>
                <p className="text-blue-200">
                  Advanced user management features will be implemented here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
