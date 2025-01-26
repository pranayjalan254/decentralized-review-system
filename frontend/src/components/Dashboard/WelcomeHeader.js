import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Copy, CheckCircle, Wallet, Coins } from "lucide-react";
import { useState, useEffect } from "react";
import { getBalance } from "../../utils/balance";
export const WelcomeHeader = ({ userName, accountAddress, userImage, }) => {
    const [copied, setCopied] = useState(false);
    const [balance, setBalance] = useState(0);
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const currentBalance = await getBalance(accountAddress);
                setBalance(currentBalance);
            }
            catch (error) {
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
    return (_jsx("div", { className: "bg-black/20 backdrop-blur-sm rounded-xl p-4 md:p-8 mb-6 border border-white/10", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-6", children: [_jsxs("div", { className: "flex items-center gap-4 sm:gap-6", children: [_jsx("img", { src: userImage, alt: userName, className: "w-14 h-14 md:w-20 md:h-20 rounded-2xl border-2 border-purple-500/50 shadow-lg" }), _jsxs("div", { children: [_jsxs("h1", { className: "text-xl md:text-3xl font-bold text-white mb-2", children: ["Welcome back, ", userName, "!"] }), _jsxs("div", { className: "inline-flex items-center gap-2 sm:gap-3 bg-white/5 rounded-lg px-2 sm:px-3 py-1.5 border border-white/5", children: [_jsx(Wallet, { className: "w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" }), _jsxs("span", { className: "font-mono text-xs sm:text-sm text-gray-300", children: [accountAddress.slice(0, 6), "...", accountAddress.slice(-4)] }), _jsx("button", { onClick: copyAddress, className: "hover:bg-white/10 p-1 rounded-md transition-colors", title: "Copy address", children: copied ? (_jsx(CheckCircle, { className: "w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" })) : (_jsx(Copy, { className: "w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hover:text-white" })) })] })] })] }), _jsxs("div", { className: "flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-0 sm:mb-1", children: [_jsx("span", { className: "text-base md:text-lg text-purple-300", children: "Tokens" }), _jsx(Coins, { className: "w-5 h-5 text-purple-400" })] }), _jsx("div", { className: "bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-lg px-3 py-1 sm:px-4 sm:py-2 border border-purple-500/20", children: _jsx("span", { className: "text-xl md:text-2xl font-bold text-white", children: balance }) })] })] }) }));
};
