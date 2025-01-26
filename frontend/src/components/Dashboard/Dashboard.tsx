import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { WelcomeHeader } from "./WelcomeHeader";
import { StatCards } from "./StatCards";
import { FeatureContent } from "./FeatureContent";
import { getLocalKeylessAccount } from "../../lib/keyless";
import { Menu } from "lucide-react";

interface UserInfo {
  name: string;
  picture: string;
}

const Dashboard = () => {
  const [currentFeature, setCurrentFeature] = useState("home");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
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
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50 backdrop-blur-sm">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Sidebar */}
      <DashboardSidebar
        currentFeature={currentFeature}
        setCurrentFeature={setCurrentFeature}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 pt-16 lg:pt-8 min-w-0">
        <div className="max-w-[1400px] mx-auto">
          {currentFeature === "home" && (
            <>
              <WelcomeHeader
                userName={userInfo.name}
                accountAddress={accountAddress}
                userImage={userInfo.picture}
              />
              <StatCards stats={mockStats} />
            </>
          )}
          {currentFeature !== "home" && (
            <FeatureContent feature={currentFeature} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
