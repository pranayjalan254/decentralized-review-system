import { Copy, CheckCircle, Wallet, Coins } from "lucide-react";
import { useState, useEffect } from "react";
import { getBalance } from "../../utils/balance";

interface WelcomeHeaderProps {
  userName: string;
  accountAddress: string;
  userImage: string;
}

export const WelcomeHeader = ({
  userName,
  accountAddress,
  userImage,
}: WelcomeHeaderProps) => {
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const currentBalance = await getBalance(accountAddress);
        setBalance(currentBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
    const intervalId = setInterval(fetchBalance, 30000);

    return () => clearInterval(intervalId);
  }, [accountAddress]);

  const copyAddress = () => {
    navigator.clipboard.writeText(accountAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 md:p-8 mb-6 border border-white/10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src={userImage}
            alt={userName}
            className="w-14 h-14 md:w-20 md:h-20 rounded-2xl border-2 border-purple-500/50 shadow-lg"
          />
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-white mb-2">
              Welcome back, {userName}!
            </h1>
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/5 rounded-lg px-2 sm:px-3 py-1.5 border border-white/5">
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
              <span className="font-mono text-xs sm:text-sm text-gray-300">
                {accountAddress.slice(0, 6)}...{accountAddress.slice(-4)}
              </span>
              <button
                onClick={copyAddress}
                className="hover:bg-white/10 p-1 rounded-md transition-colors"
                title="Copy address"
              >
                {copied ? (
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hover:text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-0">
          <div className="flex items-center gap-2 mb-0 sm:mb-1">
            <span className="text-base md:text-lg text-purple-300">Tokens</span>
            <Coins className="w-5 h-5 text-purple-400" />
          </div>
          <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-lg px-3 py-1 sm:px-4 sm:py-2 border border-purple-500/20">
            <span className="text-xl md:text-2xl font-bold text-white">
              {balance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
