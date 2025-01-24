import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { WelcomeHeader } from "./WelcomeHeader";
import { StatCards } from "./StatCards";
import { FeatureContent } from "./FeatureContent";

const Dashboard = () => {
  const [currentFeature, setCurrentFeature] = useState("home");
  const mockUser = {
    name: "John Doe",
    tokenBalance: 1250,
  };

  const mockStats = {
    reviews: 24,
    surveysCompleted: 15,
    dataLabelled: 1250,
    tokensEarned: 450,
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50 backdrop-blur-sm">
      <DashboardSidebar
        currentFeature={currentFeature}
        setCurrentFeature={setCurrentFeature}
      />
      <div className="flex-1 p-5">
        {currentFeature === "home" && (
          <>
            <WelcomeHeader
              userName={mockUser.name}
              tokenBalance={mockUser.tokenBalance}
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
