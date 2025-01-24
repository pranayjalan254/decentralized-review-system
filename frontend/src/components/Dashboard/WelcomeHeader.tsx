import { DollarSign } from "lucide-react";

interface WelcomeHeaderProps {
  userName: string;
  tokenBalance: number;
}

export const WelcomeHeader = ({
  userName,
  tokenBalance,
}: WelcomeHeaderProps) => {
  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6 border border-white/10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-300 mt-1">
            Here's what's happening with your account today.
          </p>
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg px-4 py-2 flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-white" />
          <span className="font-semibold text-white">
            {tokenBalance} Tokens
          </span>
        </div>
      </div>
    </div>
  );
};
