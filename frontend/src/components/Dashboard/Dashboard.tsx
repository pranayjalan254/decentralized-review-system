import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { WelcomeHeader } from "./WelcomeHeader";
import { StatCards } from "./StatCards";
import { FeatureContent } from "./FeatureContent";
import { getLocalKeylessAccount } from "../../lib/keyless";

interface UserInfo {
  name: string;
  picture: string;
}

const Dashboard = () => {
  const [currentFeature, setCurrentFeature] = useState("home");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
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
      <DashboardSidebar
        currentFeature={currentFeature}
        setCurrentFeature={setCurrentFeature}
      />
      <div className="flex-1 p-8">
        {currentFeature === "home" && (
          <>
            <WelcomeHeader
              userName={userInfo.name}
              accountAddress={accountAddress}
              userImage={userInfo.picture}
              tokens={450}
            />
            <StatCards stats={mockStats} />
          </>
        )}
        {currentFeature !== "home" && (
          <FeatureContent feature={currentFeature} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
