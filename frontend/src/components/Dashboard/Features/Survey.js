import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
export default function Survey() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, _setLoading] = useState(false);
    const [surveyTitle, setSurveyTitle] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [numberOfQuestions, setNumberOfQuestions] = useState(1);
    const [additionalRequirements, setAdditionalRequirements] = useState("");
    const [generatingQuestions, setGeneratingQuestions] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [formUrl, setFormUrl] = useState("");
    const [showMySurveys, setShowMySurveys] = useState(false);
    const [creatingForm, setCreatingForm] = useState(false);
    const [authUrl, setAuthUrl] = useState(null);
    const [authCode, setAuthCode] = useState(null);
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin ===
                "https://decentralized-review-system-r7vv.onrender.com" &&
                event.data.code) {
                setAuthCode(event.data.code);
                setAuthUrl(null);
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);
    const getAuthUrlAndShow = async () => {
        try {
            const response = await fetch("https://decentralized-review-system.onrender.com/get-auth-url");
            const data = await response.json();
            if (data.authUrl) {
                setAuthUrl(data.authUrl);
                window.open(data.authUrl, "Google Auth", "width=600,height=600");
            }
        }
        catch (error) {
            console.error("Error getting auth URL:", error);
        }
    };
    const handleGenerateQuestions = async () => {
        try {
            setGeneratingQuestions(true);
            const response = await fetch("https://decentralized-review-system.onrender.com/generate-questions", {
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
            }
            else {
                setQuestions([]);
            }
        }
        catch (error) {
            console.error("Error generating questions:", error);
            alert("Failed to generate questions. Please try again.");
        }
        finally {
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
            const response = await fetch("https://decentralized-review-system.onrender.com/create-survey", {
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
        }
        catch (error) {
            console.error("Error creating survey:", error);
        }
        finally {
            setCreatingForm(false);
        }
    };
    return (_jsxs("div", { className: "space-y-4 sm:space-y-6", children: [_jsxs("div", { className: "bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10", children: [_jsx("h2", { className: "text-xl font-semibold mb-6 text-white", children: showMySurveys ? "My Surveys" : "Surveys & Rewards" }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx("input", { type: "text", placeholder: `Search ${showMySurveys ? "my" : "available"} surveys...`, value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500" }), _jsx(Search, { className: "absolute left-3 top-2.5 w-5 h-5 text-gray-400" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setShowMySurveys(!showMySurveys), className: "w-full sm:w-auto px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2", children: showMySurveys ? "All Surveys" : "My Surveys" }), _jsxs("button", { onClick: () => setIsModalOpen(true), className: "w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2", children: [_jsx(PlusCircle, { className: "w-5 h-5" }), "Create Survey"] })] })] })] }), loading ? (_jsx("div", { className: "flex justify-center", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-purple-500" }) })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: (showMySurveys ? myDummySurveys : dummySurveys).map((survey) => (_jsxs("div", { className: "group bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 h-[180px] relative cursor-pointer hover:bg-white/5 transition-colors", children: [_jsxs("div", { className: "h-[120px] space-y-2", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx("h3", { className: "text-white font-semibold text-lg line-clamp-1", children: survey.title }), _jsxs("span", { className: "bg-purple-500/20 px-2 py-1 rounded-full text-purple-400 text-sm", children: [survey.reward, " tokens"] })] }), _jsx("p", { className: "text-gray-400 text-sm", children: survey.company }), _jsxs("p", { className: "text-gray-300 text-sm", children: ["Category: ", survey.category] })] }), _jsxs("div", { className: "absolute bottom-4 inset-x-4 flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-400", children: [_jsx("span", { children: survey.estimatedTime }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: [survey.respondents, " responses"] })] }), showMySurveys ? (_jsx("a", { 
                                    // @ts-ignore
                                    href: survey.formUrl, target: "_blank", rel: "noopener noreferrer", className: "text-sm text-purple-400 hover:text-purple-300 transition-colors", children: "View form \u2192" })) : (_jsx("span", { className: "text-sm text-purple-400 group-hover:text-purple-300 transition-colors", children: "Take survey \u2192" }))] })] }, survey.id))) })), isModalOpen && (_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-gray-900 rounded-lg p-4 sm:p-6 w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-xl font-semibold text-white", children: "Create New Survey" }), _jsx("button", { onClick: () => setIsModalOpen(false), className: "text-gray-400 hover:text-white", children: "\u2715" })] }), _jsx("div", { className: "space-y-4", children: formUrl ? (_jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "text-lg font-semibold text-white", children: "Survey Created Successfully!" }), _jsx("p", { className: "text-gray-400", children: "Your survey is ready:" }), _jsxs("div", { className: "flex flex-col gap-4", children: [_jsx("a", { href: formUrl, target: "_blank", rel: "noopener noreferrer", className: "block w-full p-3 bg-white/10 rounded-lg text-purple-400 hover:text-purple-300 break-all", children: formUrl }), _jsx("button", { onClick: () => {
                                                    setIsModalOpen(false);
                                                    setFormUrl("");
                                                    setQuestions([]);
                                                }, className: "w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all", children: "Close" })] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-2", children: "Survey Title" }), _jsx("input", { type: "text", value: surveyTitle, onChange: (e) => setSurveyTitle(e.target.value), className: "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500", placeholder: "Enter survey title" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-2", children: "Target Audience" }), _jsx("input", { type: "text", value: targetAudience, onChange: (e) => setTargetAudience(e.target.value), className: "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500", placeholder: "Enter target audience" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-2", children: "Number of Questions" }), _jsx("input", { type: "number", value: numberOfQuestions, onChange: (e) => setNumberOfQuestions(Number(e.target.value)), className: "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500", placeholder: "Enter number of questions" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-2", children: "Additional Requirements (Optional)" }), _jsx("textarea", { value: additionalRequirements, onChange: (e) => setAdditionalRequirements(e.target.value), className: "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500", placeholder: "Describe any additional requirements...", rows: 4 })] }), _jsxs("button", { onClick: handleGenerateQuestions, disabled: generatingQuestions ||
                                            !surveyTitle ||
                                            !targetAudience ||
                                            !numberOfQuestions, className: "mt-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 disabled:opacity-50", children: [generatingQuestions ? (_jsx(Loader2, { className: "w-5 h-5 animate-spin" })) : (_jsx(SparklesIcon, { className: "w-5 h-5" })), generatingQuestions
                                                ? "Generating..."
                                                : "Generate Questions"] }), questions && questions.length > 0 && (_jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "text-lg font-semibold text-white", children: "Generated Questions" }), _jsx("ul", { className: "space-y-4 text-gray-400", children: questions.map((q, index) => (_jsxs("li", { className: "bg-white/5 p-4 rounded-lg", children: [_jsxs("div", { className: "font-medium text-white mb-2", children: [index + 1, ". ", q.question] }), _jsxs("div", { className: "text-sm text-gray-500 mb-2", children: ["Type: ", q.type.replace(/_/g, " ").toLowerCase()] }), (q.type === "multiple_choice" ||
                                                            q.type === "checkbox") &&
                                                            q.options && (_jsx("div", { className: "ml-4 space-y-1", children: q.options.map((option, i) => (_jsxs("div", { className: "flex items-center gap-2", children: [q.type === "multiple_choice" ? (_jsx("div", { className: "w-3 h-3 rounded-full border border-gray-500" })) : (_jsx("div", { className: "w-3 h-3 rounded-sm border border-gray-500" })), _jsx("span", { children: option })] }, i))) })), q.type === "linear_scale" &&
                                                            q.scale &&
                                                            q.labels && (_jsxs("div", { className: "ml-4", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: q.labels.start }), _jsx("span", { children: q.labels.end })] }), _jsxs("div", { className: "flex justify-between text-xs mt-1", children: [_jsx("span", { children: q.scale.min }), _jsx("span", { children: q.scale.max })] })] })), (q.type === "short_answer" ||
                                                            q.type === "paragraph") && (_jsx("div", { className: "ml-4 text-sm italic", children: q.type === "short_answer"
                                                                ? "Short text response"
                                                                : "Long text response" }))] }, index))) }), _jsx("button", { onClick: handleCreateSurvey, disabled: creatingForm, className: "mt-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 disabled:opacity-50", children: creatingForm ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), "Creating Survey..."] })) : ("Create Survey") }), authUrl && (_jsx("div", { className: "text-sm text-gray-400 mt-2", children: "Please authenticate with Google to create the survey. A popup window should appear." }))] }))] })) }), " "] }) }))] }));
}
