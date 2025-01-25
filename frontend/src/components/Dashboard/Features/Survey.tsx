import { useState } from "react";
import { Search, Loader2, PlusCircle, SparklesIcon } from "lucide-react";

const dummySurveys = [
  {
    id: 1,
    title: "Customer Experience Feedback",
    company: "TechCorp Inc.",
    reward: 50,
    estimatedTime: "5-10 mins",
    respondents: 145,
    category: "Product",
  },
  {
    id: 2,
    title: "User Interface Satisfaction",
    company: "DesignLabs Co.",
    reward: 75,
    estimatedTime: "8-12 mins",
    respondents: 89,
    category: "UX/UI",
  },
  {
    id: 3,
    title: "Food Delivery Service Review",
    company: "QuickBite",
    reward: 40,
    estimatedTime: "3-5 mins",
    respondents: 234,
    category: "Service",
  },
];

export default function Survey() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, _setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-6 text-white">
          Surveys & Rewards
        </h2>

        {/* Search and Create Survey */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search available surveys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Create Survey
          </button>
        </div>
      </div>

      {/* Survey List */}
      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dummySurveys.map((survey) => (
            <div
              key={survey.id}
              className="group bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 h-[180px] relative cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="h-[120px] space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-semibold text-lg line-clamp-1">
                    {survey.title}
                  </h3>
                  <span className="bg-purple-500/20 px-2 py-1 rounded-full text-purple-400 text-sm">
                    {survey.reward} tokens
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{survey.company}</p>
                <p className="text-gray-300 text-sm">
                  Category: {survey.category}
                </p>
              </div>
              <div className="absolute bottom-4 inset-x-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{survey.estimatedTime}</span>
                  <span>•</span>
                  <span>{survey.respondents} responses</span>
                </div>
                <span className="text-sm text-purple-400 group-hover:text-purple-300 transition-colors">
                  Take survey →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Survey Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                Create New Survey
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Survey Title
                </label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="Enter survey title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Generate with AI
                </label>
                <div className="flex gap-2">
                  <textarea
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    placeholder="Describe your survey requirements..."
                    rows={4}
                  />
                </div>
                <button className="mt-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5" />
                  Generate Questions
                </button>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                  Create Survey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
