import { Star, ClipboardList, Award, TrendingUp } from "lucide-react";

interface Stats {
  reviews: number;
  surveysCompleted: number;
  dataLabelled: number;
  tokensEarned: number;
}

export const StatCards = ({ stats }: { stats: Stats }) => {
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
    {
      title: "Tokens Earned",
      value: stats.tokensEarned,
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">{card.title}</p>
              <p className="text-2xl font-bold mt-1 text-white">{card.value}</p>
            </div>
            <div className={`${card.bgColor} p-3 rounded-full`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
