import { Star, ClipboardList, Award, Home } from "lucide-react";
import { cn } from "./lib/utils";

interface SidebarProps {
  currentFeature: string;
  setCurrentFeature: (feature: string) => void;
}

export const DashboardSidebar = ({
  currentFeature,
  setCurrentFeature,
}: SidebarProps) => {
  const menuItems = [
    { id: "home", label: "Overview", icon: Home },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "surveys", label: "Surveys", icon: ClipboardList },
    { id: "labelling", label: "Data Labelling", icon: Award },
  ];

  return (
    <div className="h-screen w-64 bg-black/20 backdrop-blur-sm border-r border-white/10 p-4">
      <div className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentFeature(item.id)}
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
