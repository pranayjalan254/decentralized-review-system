import { Star, ClipboardList, Award, Home, Store, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";

interface SidebarProps {
  currentFeature: string;
  setCurrentFeature: (feature: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export const DashboardSidebar = ({
  currentFeature,
  setCurrentFeature,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: SidebarProps) => {
  const handleMenuItemClick = (itemId: string) => {
    setCurrentFeature(itemId);
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    { id: "home", label: "Overview", icon: Home },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "surveys", label: "Surveys", icon: ClipboardList },
    { id: "labelling", label: "Data Labelling", icon: Award },
    { id: "store", label: "Store", icon: Store },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-black/20 backdrop-blur-sm border-r border-white/10 p-4 transition-transform duration-300 lg:relative lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <Link
        to="/"
        className="block mb-8 py-2 px-4 -mx-4 border-b border-white/10"
      >
        <h1 className="text-2xl font-bold text-white">TrueScore</h1>
      </Link>

      <button
        onClick={() => setIsMobileMenuOpen(false)}
        className="lg:hidden absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <div className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuItemClick(item.id)}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
              currentFeature === item.id
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                : "text-gray-300 hover:bg-white/10"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
