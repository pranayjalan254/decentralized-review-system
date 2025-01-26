import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Star, ClipboardList, Award } from "lucide-react";
export const StatCards = ({ stats }) => {
    const cards = [
        {
            title: "Reviews Written",
            value: stats.reviews,
            icon: Star,
            color: "text-yellow-400",
            bgColor: "bg-yellow-400/10",
        },
        {
            title: "Surveys Completed",
            value: stats.surveysCompleted,
            icon: ClipboardList,
            color: "text-purple-400",
            bgColor: "bg-purple-400/10",
        },
        {
            title: "Data Points Labelled",
            value: stats.dataLabelled,
            icon: Award,
            color: "text-pink-400",
            bgColor: "bg-pink-400/10",
        },
    ];
    return (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6", children: cards.map((card) => (_jsx("div", { className: "bg-black/20 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/10", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-300 text-sm", children: card.title }), _jsx("p", { className: "text-2xl font-bold mt-1 text-white", children: card.value })] }), _jsx("div", { className: `${card.bgColor} p-3 rounded-full`, children: _jsx(card.icon, { className: `w-6 h-6 ${card.color}` }) })] }) }, card.title))) }));
};
