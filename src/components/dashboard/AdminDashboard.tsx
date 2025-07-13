
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/types/user";
import { Users, Building, Settings, BarChart3, CheckCircle, XCircle } from "lucide-react";

interface AdminDashboardProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminDashboard = ({ user, activeTab, setActiveTab }: AdminDashboardProps) => {
  // Mock data for demonstration
  const pendingApprovals = [
    { id: "1", businessName: "ABC Textiles Ltd", owner: "John Doe", status: "pending" },
    { id: "2", businessName: "Fashion Hub Co", owner: "Jane Smith", status: "pending" },
  ];

  const systemStats = {
    totalBusinesses: 15,
    activeUsers: 45,
    totalStores: 32,
    systemUptime: "99.9%"
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Building className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-white font-medium">Total Businesses</p>
                <p className="text-2xl font-bold text-white">{systemStats.totalBusinesses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-white font-medium">Active Users</p>
                <p className="text-2xl font-bold text-white">{systemStats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Building className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-white font-medium">Total Stores</p>
                <p className="text-2xl font-bold text-white">{systemStats.totalStores}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <BarChart3 className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-white font-medium">System Uptime</p>
                <p className="text-2xl font-bold text-white">{systemStats.systemUptime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/10 border-white/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">Overview</TabsTrigger>
          <TabsTrigger value="approvals" className="data-[state=active]:bg-white/20">Pending Approvals</TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-white/20">User Management</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white/20">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">System Overview</CardTitle>
              <CardDescription className="text-blue-200">
                Monitor system performance and user activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-white">
                <p>Welcome to the admin dashboard. Here you can manage business approvals, monitor system performance, and configure application settings.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Pending Business Approvals</CardTitle>
              <CardDescription className="text-blue-200">
                Review and approve new business registrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingApprovals.map((business) => (
                <div key={business.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">{business.businessName}</h3>
                    <p className="text-blue-200 text-sm">Owner: {business.owner}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive">
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">User Management</CardTitle>
              <CardDescription className="text-blue-200">
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white">User management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">System Settings</CardTitle>
              <CardDescription className="text-blue-200">
                Configure application settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white">System settings interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
