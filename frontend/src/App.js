import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./components/LandingPage/LandingPage";
import Dashboard from "./components/Dashboard/Dashboard";
import Callback from "./components/Auth/Callback";
import { TokenProvider } from "./contexts/TokenContext";
function App() {
    return (_jsx(TokenProvider, { children: _jsx(BrowserRouter, { children: _jsxs("div", { className: "min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden", children: [_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/callback", element: _jsx(Callback, {}) })] }), _jsx(Toaster, { position: "top-right", toastOptions: {
                            duration: 4000,
                            style: {
                                background: "#1F2937",
                                color: "#fff",
                            },
                        } })] }) }) }));
}
export default App;
