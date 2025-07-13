
import { useState } from "react";
import { User } from "@/types/user";
import AdminDashboard from "./AdminDashboard";
import BusinessOwnerDashboard from "./BusinessOwnerDashboard";
import AssistantDashboard from "./AssistantDashboard";
import Header from "./Header";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderDashboard = () => {
    switch (user.role) {
      case "admin":
        return <AdminDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
      case "business_owner":
        return <BusinessOwnerDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
      case "assistant":
        return <AssistantDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Header user={user} onLogout={onLogout} />
      <div className="container mx-auto p-6">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;
