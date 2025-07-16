
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCheck } from 'lucide-react';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "business_owner" | "assistant">("business_owner");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDemoLogin = () => {
    const demoUser: User = {
      id: "demo-user-123",
      username: username || "demo_user",
      name: username || "Demo User",
      role,
      businessName: role === 'business_owner' ? "Mubusi Textile Company" : undefined,
      location: "Dar es Salaam, Tanzania",
      phone: "+255123456789",
      isActive: true
    };

    toast({
      title: "Demo Login Successful",
      description: `Logged in as ${role.replace('_', ' ')}`,
    });

    onLogin(demoUser);
  };

  const handleSupabaseLogin = async () => {
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // For this demo, we'll use email format: username@textile.com
      const email = username.includes('@') ? username : `${username}@textile.com`;
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // If login fails, try to sign up the user
        const { data: newUserData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              username,
              name: username,
              role
            }
          }
        });

        if (signUpError) throw signUpError;

        if (newUserData.user) {
          // Create user profile
          const { error: profileError } = await supabase
            .from('users')
            .upsert({
              id: newUserData.user.id,
              username,
              name: username,
              role,
              business_name: role === 'business_owner' ? "Mubusi Textile Company" : null,
              location: "Dar es Salaam, Tanzania",
              phone: "+255123456789"
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }

          toast({
            title: "Account Created",
            description: "New account created and logged in successfully",
          });
        }
      }

      // Get user profile
      const currentUser = authData?.user || newUserData?.user;
      if (currentUser) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        const user: User = {
          id: currentUser.id,
          username: profile?.username || username,
          name: profile?.name || username,
          role: profile?.role || role,
          businessName: profile?.business_name,
          location: profile?.location,
          phone: profile?.phone,
          isActive: profile?.is_active ?? true
        };

        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });

        onLogin(user);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-white">
            Mubusi Textile System
          </CardTitle>
          <CardDescription className="text-blue-200">
            Inventory Control & Monitoring System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-white text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400"
                placeholder="Enter your username"
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-white text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="role" className="text-white text-sm font-medium">
                Role
              </Label>
              <Select value={role} onValueChange={(value: any) => setRole(value)} disabled={loading}>
                <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white focus:border-blue-400 focus:ring-blue-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="admin" className="text-white hover:bg-slate-700">
                    System Administrator
                  </SelectItem>
                  <SelectItem value="business_owner" className="text-white hover:bg-slate-700">
                    Business Owner
                  </SelectItem>
                  <SelectItem value="assistant" className="text-white hover:bg-slate-700">
                    Assistant
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleSupabaseLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-white/60">Or</span>
              </div>
            </div>

            <Button
              onClick={handleDemoLogin}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 transition-colors"
              disabled={loading}
            >
              Demo Login (No Password Required)
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-blue-200">
              For demo: Use any username and role selection
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
