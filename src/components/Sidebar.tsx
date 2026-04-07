import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  User as UserIcon, 
  Droplets, 
  CloudSun, 
  LogOut,
  TrendingUp,
  Settings,
  Sprout
} from 'lucide-react';
import { useApp } from '../AppContext';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, setCurrentUser } = useApp();

  const farmerLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
    { id: 'crops', label: 'Crop Planning', icon: Sprout },
    { id: 'water', label: 'Water Usage', icon: Droplets },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'profile', label: 'My Profile', icon: UserIcon },
  ];

  const dealerLinks = [
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
  ];

  const adminLinks = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'farmers', label: 'Farmers', icon: UserIcon },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'All Orders', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const links = currentUser?.role === 'farmer' ? farmerLinks : 
                currentUser?.role === 'dealer' ? dealerLinks : adminLinks;

  return (
    <div className="w-64 sidebar-gradient h-screen fixed left-0 top-0 text-white p-6 flex flex-col z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-white p-2 rounded-xl">
          <Sprout className="text-primary-700 w-6 h-6" />
        </div>
        <h1 className="font-display text-xl leading-tight">Smart<br/>Agri</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === link.id 
                ? "bg-white/20 text-white shadow-lg" 
                : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <link.icon className={cn(
              "w-5 h-5 transition-transform group-hover:scale-110",
              activeTab === link.id ? "text-white" : "text-white/60"
            )} />
            <span className="font-medium">{link.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
            {currentUser?.username[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold truncate">{currentUser?.username}</p>
            <p className="text-xs text-white/60 capitalize">{currentUser?.role}</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentUser(null)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
