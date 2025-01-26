import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Star, ClipboardList, Award, Home, Store, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";
export const DashboardSidebar = ({ currentFeature, setCurrentFeature, isMobileMenuOpen, setIsMobileMenuOpen, }) => {
    const handleMenuItemClick = (itemId) => {
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
    return (_jsxs("div", { className: cn("fixed inset-y-0 left-0 z-40 w-64 bg-black/20 backdrop-blur-sm border-r border-white/10 p-4 transition-transform duration-300 lg:relative lg:translate-x-0", isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"), children: [_jsx(Link, { to: "/", className: "block mb-8 py-2 px-4 -mx-4 border-b border-white/10", children: _jsx("h1", { className: "text-2xl font-bold text-white", children: "TrueScore" }) }), _jsx("button", { onClick: () => setIsMobileMenuOpen(false), className: "lg:hidden absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg", children: _jsx(X, { className: "w-5 h-5 text-white" }) }), _jsx("div", { className: "flex flex-col space-y-2", children: menuItems.map((item) => (_jsxs("button", { onClick: () => handleMenuItemClick(item.id), className: cn("flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors", currentFeature === item.id
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                        : "text-gray-300 hover:bg-white/10"), children: [_jsx(item.icon, { className: "w-5 h-5" }), _jsx("span", { className: "font-medium", children: item.label })] }, item.id))) })] }));
};
