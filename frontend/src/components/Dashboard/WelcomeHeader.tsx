import { Copy, CheckCircle, Wallet, Coins } from "lucide-react";
import { useState } from "react";

interface WelcomeHeaderProps {
  userName: string;
  accountAddress: string;
  userImage: string;
  tokens: number;
}

export const WelcomeHeader = ({
  userName,
  accountAddress,
  userImage,
  tokens,
}: WelcomeHeaderProps) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(accountAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 mb-6 border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <img
            src={userImage}
            alt={userName}
            className="w-20 h-20 rounded-2xl border-2 border-purple-500/50 shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {userName}!
            </h1>
            <div className="inline-flex items-center gap-3 bg-white/5 rounded-lg px-3 py-1.5 border border-white/5">
              <Wallet className="w-4 h-4 text-purple-400" />
              <span className="font-mono text-sm text-gray-300">
                {accountAddress.slice(0, 8)}...{accountAddress.slice(-4)}
              </span>
              <button
                onClick={copyAddress}
                className="hover:bg-white/10 p-1 rounded-md transition-colors"
                title="Copy address"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg text-purple-300">Tokens Earned</span>
            <Coins className="w-5 h-5 text-purple-400" />
          </div>
          <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-lg px-4 py-2 border border-purple-500/20">
            <span className="text-2xl font-bold text-white">{tokens}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
