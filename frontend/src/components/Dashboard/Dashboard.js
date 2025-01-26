import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { WelcomeHeader } from "./WelcomeHeader";
import { StatCards } from "./StatCards";
import { FeatureContent } from "./FeatureContent";
import { getLocalKeylessAccount } from "../../lib/keyless";
import { Menu } from "lucide-react";
const Dashboard = () => {
    const [currentFeature, setCurrentFeature] = useState("home");
    const [userInfo, setUserInfo] = useState(null);
    const [accountAddress, setAccountAddress] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const isAuthenticated = localStorage.getItem("isAuthenticated");
        if (!isAuthenticated) {
            navigate("/");
            return;
        }
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
        const account = getLocalKeylessAccount();
        if (account) {
            setAccountAddress(account.accountAddress.toString());
        }
    }, [navigate]);
    const mockStats = {
        reviews: 24,
        surveysCompleted: 15,
        dataLabelled: 1250,
    };
    if (!userInfo || !accountAddress) {
        return _jsx("div", { children: "Loading..." });
    }
    return (_jsxs("div", { className: "flex min-h-screen bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50 backdrop-blur-sm", children: [_jsx("button", { onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen), className: "lg:hidden fixed top-4 left-4 z-50 p-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10", children: _jsx(Menu, { className: "w-6 h-6 text-white" }) }), _jsx(DashboardSidebar, { currentFeature: currentFeature, setCurrentFeature: setCurrentFeature, isMobileMenuOpen: isMobileMenuOpen, setIsMobileMenuOpen: setIsMobileMenuOpen }), _jsx("div", { className: "flex-1 p-4 md:p-6 lg:p-8 pt-16 lg:pt-8 min-w-0", children: _jsxs("div", { className: "max-w-[1400px] mx-auto", children: [currentFeature === "home" && (_jsxs(_Fragment, { children: [_jsx(WelcomeHeader, { userName: userInfo.name, accountAddress: accountAddress, userImage: userInfo.picture }), _jsx(StatCards, { stats: mockStats })] })), currentFeature !== "home" && (_jsx(FeatureContent, { feature: currentFeature }))] }) })] }));
};
export default Dashboard;
