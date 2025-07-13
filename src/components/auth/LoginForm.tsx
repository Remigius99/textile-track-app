
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/types/user";
import { Building2, Users, Shield } from "lucide-react";

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Demo users for testing
  const demoUsers: User[] = [
    {
      id: "1",
      username: "admin",
      role: "admin",
      name: "System Administrator",
      isActive: true
    },
    {
      id: "2", 
      username: "owner",
      role: "business_owner",
      name: "Business Owner",
      isActive: true
    },
    {
      id: "3",
      username: "assistant",
      role: "assistant", 
      name: "Store Assistant",
      storeAccess: ["store1", "store2"],
      isActive: true
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = demoUsers.find(u => u.username === username);
      if (user && password === "demo123") {
        onLogin(user);
      } else {
        alert("Invalid credentials. Use: admin/demo123, owner/demo123, or assistant/demo123");
      }
      setLoading(false);
    }, 1000);
  };

  const quickLogin = (user: User) => {
    setUsername(user.username);
    setPassword("demo123");
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Mubusi Textile</h1>
          <p className="text-blue-200">Inventory Control & Monitoring System</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Sign In</CardTitle>
            <CardDescription className="text-blue-200">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <p className="text-sm text-blue-200 text-center">Demo Accounts:</p>
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin(demoUsers[0])}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Demo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin(demoUsers[1])}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Business Owner Demo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin(demoUsers[2])}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Assistant Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
