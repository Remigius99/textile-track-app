
import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import Dashboard from "@/components/dashboard/Dashboard";
import { User } from "@/types/user";

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {!currentUser ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
