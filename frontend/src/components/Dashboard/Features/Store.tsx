import { useState } from "react";
import {
  Star,
  ClipboardList,
  Award,
  Coins,
  Gift,
  Coffee,
  Utensils,
  Hotel,
  Dumbbell,
  Store as StoreIcon,
} from "lucide-react";

const earningActivities = [
  {
    title: "Write a Review",
    description:
      "Share your authentic experience and help others make informed decisions",
    tokens: 200,
    icon: Star,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
  },
  {
    title: "Complete a Survey",
    description:
      "Participate in business surveys and provide valuable feedback",
    tokens: 500,
    icon: ClipboardList,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  {
    title: "Data Labelling",
    description: "Help improve AI systems by labelling data points",
    tokens: 100,
    icon: Award,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
  },
];

const rewardCategories = [
  {
    id: "restaurants",
    label: "Restaurants",
    icon: Utensils,
    rewards: [
      { title: "Domino's Pizza Voucher", tokens: 800, available: true },
      { title: "McDonald's Meal", tokens: 500, available: true },
      { title: "KFC Bucket", tokens: 700, available: false },
      { title: "Subway Sandwich", tokens: 400, available: true },
    ],
  },
  {
    id: "hotels",
    label: "Hotels",
    icon: Hotel,
    rewards: [
      { title: "OYO Rooms Discount", tokens: 2000, available: true },
      { title: "Airbnb Credit", tokens: 3000, available: true },
      { title: "Hotel Night Stay", tokens: 5000, available: false },
    ],
  },
  {
    id: "gyms",
    label: "Fitness",
    icon: Dumbbell,
    rewards: [
      { title: "Cult.fit Pass", tokens: 1500, available: true },
      { title: "Gold's Gym Monthly", tokens: 2500, available: true },
      { title: "Personal Training Session", tokens: 1000, available: true },
    ],
  },
  {
    id: "cafes",
    label: "Cafes",
    icon: Coffee,
    rewards: [
      { title: "Starbucks Gift Card", tokens: 600, available: true },
      { title: "Costa Coffee Voucher", tokens: 500, available: true },
      { title: "Cafe Coffee Day Credit", tokens: 400, available: false },
    ],
  },
  {
    id: "gift-cards",
    label: "Gift Cards",
    icon: Gift,
    rewards: [
      { title: "Amazon Gift Card", tokens: 1000, available: true },
      { title: "Netflix Subscription", tokens: 1200, available: true },
      { title: "Spotify Premium", tokens: 800, available: true },
      { title: "Steam Wallet Code", tokens: 1500, available: false },
    ],
  },
];

export default function Store() {
  const [selectedCategory, setSelectedCategory] = useState(
    rewardCategories[0].id
  );

  const CategoryIcon =
    rewardCategories.find((cat) => cat.id === selectedCategory)?.icon ||
    StoreIcon;

  return (
    <div className="space-y-8">
      {/* Earning Section */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Coins className="w-6 h-6 text-yellow-400" />
          Earn Tokens
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {earningActivities.map((activity) => (
            <div
              key={activity.title}
              className="bg-white/5 rounded-lg p-6 border border-white/5"
            >
              <div className={`${activity.bgColor} p-3 w-fit rounded-lg mb-4`}>
                <activity.icon className={`w-6 h-6 ${activity.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {activity.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {activity.description}
              </p>
              <div className="flex items-center gap-2 text-yellow-400 font-semibold">
                <Coins className="w-4 h-4" />
                {activity.tokens} tokens
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redeem Section */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <StoreIcon className="w-6 h-6 text-purple-400" />
          Redeem Rewards
        </h2>

        {/* Category Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {rewardCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              <category.icon className="w-5 h-5" />
              {category.label}
            </button>
          ))}
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewardCategories
            .find((cat) => cat.id === selectedCategory)
            ?.rewards.map((reward, index) => (
              <div
                key={index}
                className={`bg-white/5 rounded-lg p-6 border border-white/5 ${
                  !reward.available && "opacity-50"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <CategoryIcon className="w-8 h-8 text-purple-400" />
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Coins className="w-4 h-4" />
                    <span className="font-semibold">{reward.tokens}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  {reward.title}
                </h3>
                <button
                  disabled={!reward.available}
                  className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reward.available ? "Redeem Now" : "Out of Stock"}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
