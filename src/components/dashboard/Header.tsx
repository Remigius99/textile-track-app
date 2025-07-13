
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { LogOut, Building2 } from "lucide-react";

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "admin":
        return "System Administrator";
      case "business_owner":
        return "Business Owner";
      case "assistant":
        return "Store Assistant";
      default:
        return role;
    }
  };

  return (
    <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Building2 className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Mubusi Textile</h1>
              <p className="text-sm text-blue-200">Inventory Management System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-blue-200 text-sm">{getRoleDisplay(user.role)}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
