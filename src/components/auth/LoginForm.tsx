
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/user";

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Fetch user profile data
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (userError) throw userError;

        const user: User = {
          id: userData.id,
          username: userData.username,
          role: userData.role,
          name: userData.name,
          isActive: userData.is_active,
          storeAccess: []
        };

        onLogin(user);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${userData.name}!`,
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: 'admin' | 'business_owner' | 'assistant') => {
    // Demo login for testing
    const demoUser: User = {
      id: `demo-${role}`,
      username: `demo_${role}`,
      role,
      name: role === 'admin' ? 'System Admin' : 
            role === 'business_owner' ? 'John Mubusi' : 
            'Store Assistant',
      isActive: true,
      storeAccess: role === 'assistant' ? ['store1', 'store2'] : undefined
    };
    onLogin(demoUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Building2 className="w-12 h-12 text-blue-400" />
          </div>
          <CardTitle className="text-2xl text-white">Mubusi Textile</CardTitle>
          <CardDescription className="text-blue-200">
            Inventory Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-sm text-blue-200 text-center mb-3">Demo Login (for testing):</p>
            <div className="space-y-2">
              <Button 
                onClick={() => handleDemoLogin('admin')}
                variant="outline" 
                className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                size="sm"
              >
                Login as Admin
              </Button>
              <Button 
                onClick={() => handleDemoLogin('business_owner')}
                variant="outline" 
                className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                size="sm"
              >
                Login as Business Owner
              </Button>
              <Button 
                onClick={() => handleDemoLogin('assistant')}
                variant="outline" 
                className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                size="sm"
              >
                Login as Assistant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
