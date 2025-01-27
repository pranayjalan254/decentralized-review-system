import { useState, useEffect } from "react";
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

const myDummySurveys = [
  {
    id: 1,
    title: "Product Feedback Survey",
    company: "My Company",
    reward: 100,
    estimatedTime: "5-7 mins",
    respondents: 45,
    category: "Product",
    formUrl: "https://docs.google.com/forms/d/xxx/viewform",
    createdAt: "2024-03-15",
  },
  {
    id: 2,
    title: "Employee Satisfaction Survey",
    company: "My Company",
    reward: 80,
    estimatedTime: "10-12 mins",
    respondents: 23,
    category: "HR",
    formUrl: "https://docs.google.com/forms/d/yyy/viewform",
    createdAt: "2024-03-14",
  },
];

interface Question {
  question: string;
  type: string;
  options?: string[];
  scale?: {
    min: number;
    max: number;
  };
  labels?: {
    start: string;
    end: string;
  };
}

export default function Survey() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, _setLoading] = useState(false);
  const [surveyTitle, setSurveyTitle] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formUrl, setFormUrl] = useState("");
  const [showMySurveys, setShowMySurveys] = useState(false);
  const [creatingForm, setCreatingForm] = useState(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [authCode, setAuthCode] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === "http://localhost:3001" && event.data.code) {
        setAuthCode(event.data.code);
        setAuthUrl(null);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const getAuthUrlAndShow = async () => {
    try {
      const response = await fetch("http://localhost:5000/get-auth-url");
      const data = await response.json();
      if (data.authUrl) {
        setAuthUrl(data.authUrl);
        window.open(data.authUrl, "Google Auth", "width=600,height=600");
      }
    } catch (error) {
      console.error("Error getting auth URL:", error);
    }
  };

  const handleGenerateQuestions = async () => {
    try {
      setGeneratingQuestions(true);
      const response = await fetch("http://localhost:5000/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surveyTitle,
          targetAudience,
          numberOfQuestions,
          additionalRequirements,
        }),
      });
      const data = await response.json();
      if (data.questions) {
        setQuestions(data.questions);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate questions. Please try again.");
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const handleCreateSurvey = async () => {
    if (!authCode) {
      await getAuthUrlAndShow();
      return;
    }

    try {
      setCreatingForm(true);
      const response = await fetch("http://localhost:5000/create-survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions,
          surveyTitle,
          authCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || "Failed to create survey");
      }

      if (data.formUrl) {
        setFormUrl(data.formUrl);
      }
    } catch (error) {
      console.error("Error creating survey:", error);
    } finally {
      setCreatingForm(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-6 text-white">
          {showMySurveys ? "My Surveys" : "Surveys & Rewards"}
        </h2>

        {/* Search and Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={`Search ${
                showMySurveys ? "my" : "available"
              } surveys...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowMySurveys(!showMySurveys)}
              className="w-full sm:w-auto px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              {showMySurveys ? "All Surveys" : "My Surveys"}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Create Survey
            </button>
          </div>
        </div>
      </div>

      {/* Survey List */}
      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(showMySurveys ? myDummySurveys : dummySurveys).map((survey) => (
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
                {showMySurveys ? (
                  <a
                    // @ts-ignore
                    href={survey.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View form →
                  </a>
                ) : (
                  <span className="text-sm text-purple-400 group-hover:text-purple-300 transition-colors">
                    Take survey →
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Survey Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-4 sm:p-6 w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
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
              {formUrl ? (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">
                    Survey Created Successfully!
                  </h4>
                  <p className="text-gray-400">Your survey is ready:</p>
                  <div className="flex flex-col gap-4">
                    <a
                      href={formUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full p-3 bg-white/10 rounded-lg text-purple-400 hover:text-purple-300 break-all"
                    >
                      {formUrl}
                    </a>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setFormUrl("");
                        setQuestions([]);
                      }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Survey Title
                    </label>
                    <input
                      type="text"
                      value={surveyTitle}
                      onChange={(e) => setSurveyTitle(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      placeholder="Enter survey title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      placeholder="Enter target audience"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      value={numberOfQuestions}
                      onChange={(e) =>
                        setNumberOfQuestions(Number(e.target.value))
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      placeholder="Enter number of questions"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Additional Requirements (Optional)
                    </label>
                    <textarea
                      value={additionalRequirements}
                      onChange={(e) =>
                        setAdditionalRequirements(e.target.value)
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      placeholder="Describe any additional requirements..."
                      rows={4}
                    />
                  </div>

                  <button
                    onClick={handleGenerateQuestions}
                    disabled={
                      generatingQuestions ||
                      !surveyTitle ||
                      !targetAudience ||
                      !numberOfQuestions
                    }
                    className="mt-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {generatingQuestions ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <SparklesIcon className="w-5 h-5" />
                    )}
                    {generatingQuestions
                      ? "Generating..."
                      : "Generate Questions"}
                  </button>

                  {questions && questions.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">
                        Generated Questions
                      </h4>
                      <ul className="space-y-4 text-gray-400">
                        {questions.map((q, index) => (
                          <li key={index} className="bg-white/5 p-4 rounded-lg">
                            <div className="font-medium text-white mb-2">
                              {index + 1}. {q.question}
                            </div>
                            <div className="text-sm text-gray-500 mb-2">
                              Type: {q.type.replace(/_/g, " ").toLowerCase()}
                            </div>
                            {(q.type === "multiple_choice" ||
                              q.type === "checkbox") &&
                              q.options && (
                                <div className="ml-4 space-y-1">
                                  {q.options.map((option, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center gap-2"
                                    >
                                      {q.type === "multiple_choice" ? (
                                        <div className="w-3 h-3 rounded-full border border-gray-500" />
                                      ) : (
                                        <div className="w-3 h-3 rounded-sm border border-gray-500" />
                                      )}
                                      <span>{option}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            {q.type === "linear_scale" &&
                              q.scale &&
                              q.labels && (
                                <div className="ml-4">
                                  <div className="flex justify-between text-sm">
                                    <span>{q.labels.start}</span>
                                    <span>{q.labels.end}</span>
                                  </div>
                                  <div className="flex justify-between text-xs mt-1">
                                    <span>{q.scale.min}</span>
                                    <span>{q.scale.max}</span>
                                  </div>
                                </div>
                              )}
                            {(q.type === "short_answer" ||
                              q.type === "paragraph") && (
                              <div className="ml-4 text-sm italic">
                                {q.type === "short_answer"
                                  ? "Short text response"
                                  : "Long text response"}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={handleCreateSurvey}
                        disabled={creatingForm}
                        className="mt-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {creatingForm ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating Survey...
                          </>
                        ) : (
                          "Create Survey"
                        )}
                      </button>
                      {authUrl && (
                        <div className="text-sm text-gray-400 mt-2">
                          Please authenticate with Google to create the survey.
                          A popup window should appear.
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>{" "}
          </div>
        </div>
      )}
    </div>
  );
}
