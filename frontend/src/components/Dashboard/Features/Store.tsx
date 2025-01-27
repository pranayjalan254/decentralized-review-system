import { useState, useEffect } from "react";
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
  PlaneIcon,
  Copy,
  Check,
} from "lucide-react";
import { burn } from "../../../utils/burn";
import toast from "react-hot-toast";
import { getLocalKeylessAccount } from "../../../lib/keyless";
import { getBalance } from "../../../utils/balance";

const earningActivities = [
  {
    title: "Data Labelling",
    description: "Help improve AI systems by labelling data points",
    tokens: 10,
    icon: Award,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
  },
  {
    title: "Write a Review",
    description:
      "Share your authentic experience and help others make informed decisions",
    tokens: 20,
    icon: Star,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
  },
  {
    title: "Complete a Survey",
    description:
      "Participate in business surveys and provide valuable feedback",
    tokens: 50,
    icon: ClipboardList,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
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
      { title: "KFC Bucket", tokens: 70, available: true },
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
      { title: "Personal Training Session1", tokens: 10, available: true },
      { title: "Personal Training Session2", tokens: 10, available: true },
      { title: "Personal Training Session3", tokens: 1000, available: true },
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

const mockCouponCodes: { [key: string]: string } = {
  "Domino's Pizza Voucher": "DOMINO-2024-XYZ",
  "McDonald's Meal": "MCD50OFF-ABC",
  "Subway Sandwich": "SUB-FREE-123",
  "KFC Bucket": "KFC-BUCKET-50",
  "OYO Rooms Discount": "OYO-SAVE-2024",
  "Airbnb Credit": "AIRBNB-500-OFF",
  "Hotel Night Stay": "HOTEL-NIGHT-24",
  "Cult.fit Pass": "CULTFIT-PASS",
  "Gold's Gym Monthly": "GOLDS-1MONTH",
  "Personal Training Session": "PT-SESSION-24",
  "Starbucks Gift Card": "SBUX-GIFT-24",
  "Costa Coffee Voucher": "COSTA-FREE-24",
  "Cafe Coffee Day Credit": "CCD-CREDIT-24",
  "Amazon Gift Card": "AMZN-GIFT-24",
  "Netflix Subscription": "NETFLIX-1M-24",
  "Spotify Premium": "SPOTIFY-3M-24",
  "Steam Wallet Code": "STEAM-WALLET-24",
  "Personal Training Session1": "sdfngihrh",
};

export default function Store() {
  const [selectedCategory, setSelectedCategory] = useState(
    rewardCategories[0].id
  );
  const [balance, setBalance] = useState(0);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [processingRewards, setProcessingRewards] = useState<{
    [key: string]: boolean;
  }>({});
  const [redeemedVouchers, setRedeemedVouchers] = useState<string[]>(() => {
    const saved = localStorage.getItem("redeemedVouchers");
    return saved ? JSON.parse(saved) : [];
  });

  const account = getLocalKeylessAccount();
  const accountAddress = account?.accountAddress.toString();

  useEffect(() => {
    const fetchBalance = async () => {
      if (accountAddress) {
        try {
          const currentBalance = await getBalance(accountAddress);
          setBalance(currentBalance);
        } catch (error) {
          console.error("Error fetching balance:", error);
          toast.error("Failed to fetch balance");
        }
      }
    };

    fetchBalance();
    const intervalId = setInterval(fetchBalance, 30000);

    return () => clearInterval(intervalId);
  }, [accountAddress]);

  useEffect(() => {
    localStorage.setItem("redeemedVouchers", JSON.stringify(redeemedVouchers));
  }, [redeemedVouchers]);

  const handleRedeem = async (reward: { title: string; tokens: number }) => {
    if (balance < reward.tokens) {
      toast.error("Insufficient balance!");
      return;
    }
    setProcessingRewards((prev) => ({ ...prev, [reward.title]: true }));
    try {
      await burn(accountAddress || "", reward.tokens);
      if (accountAddress) {
        const newBalance = await getBalance(accountAddress);
        setBalance(newBalance);
      }

      const couponCode = mockCouponCodes[reward.title];
      if (!couponCode) {
        throw new Error("Coupon code not found");
      }

      setCurrentCoupon(couponCode);
      setShowCouponModal(true);
      setRedeemedVouchers((prev) => [...prev, reward.title]);

      toast.success("Reward redeemed successfully!");
    } catch (error) {
      console.error("Error redeeming reward:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to redeem reward. Please try again."
      );
    } finally {
      setProcessingRewards((prev) => ({ ...prev, [reward.title]: false }));
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentCoupon);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success("Coupon code copied!");
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  return (
    <div className="space-y-8">
      {/* Balance Display */}
      <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl p-4 border border-white/10">
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-yellow-400" />
          <span className="text-xl font-bold text-white">
            Balance: {balance} tokens
          </span>
        </div>
      </div>

      {/* Earning Section */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Coins className="w-6 h-6 text-yellow-400" />
          Earn Tokens
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <StoreIcon className="w-6 h-6 text-purple-400" />
          Redeem Rewards
        </h2>

        {/* Category Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                  <PlaneIcon className="w-8 h-8 text-purple-400" />
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Coins className="w-4 h-4" />
                    <span className="font-semibold">{reward.tokens}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  {reward.title}
                </h3>
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={
                    !reward.available ||
                    processingRewards[reward.title] ||
                    balance < reward.tokens ||
                    redeemedVouchers.includes(reward.title)
                  }
                  className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processingRewards[reward.title] ? (
                    <>Processing...</>
                  ) : redeemedVouchers.includes(reward.title) ? (
                    "Already Redeemed"
                  ) : balance < reward.tokens ? (
                    "Insufficient Balance"
                  ) : reward.available ? (
                    "Redeem Now"
                  ) : (
                    "Out of Stock"
                  )}
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900/90 p-6 rounded-lg border border-white/10 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">
              🎉 Here's your coupon code
            </h3>
            <div className="bg-white/5 p-4 rounded-lg flex items-center justify-between mb-4">
              <code className="text-purple-400 font-mono">{currentCoupon}</code>
              <button
                onClick={copyToClipboard}
                className="text-gray-400 hover:text-white"
              >
                {isCopied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            <button
              onClick={() => {
                setShowCouponModal(false);
                setCurrentCoupon("");
                setIsCopied(false);
              }}
              className="w-full px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
