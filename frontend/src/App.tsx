import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./components/LandingPage/LandingPage";
import Dashboard from "./components/Dashboard/Dashboard";
import Callback from "./components/Auth/Callback";
import { TokenProvider } from "./contexts/TokenContext";

function App() {
  return (
    <TokenProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/callback" element={<Callback />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1F2937",
                color: "#fff",
              },
            }}
          />
        </div>
      </BrowserRouter>
    </TokenProvider>
  );
}

export default App;
