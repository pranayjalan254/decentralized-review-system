import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initializeAptosKeyless } from "../../lib/auth";
import { getLocalKeylessAccount } from "../../lib/keyless";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function Callback() {
  const navigate = useNavigate();
  const [_error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 1. Extract authorization code from URL query
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) throw new Error("Missing authorization code");

        // 2. Exchange code for JWT via serverless function
        const response = await axios.post("/api/auth/token", { code });
        const { id_token } = response.data.id_token;

        // 3. Existing Aptos initialization logic
        const existingAccount = getLocalKeylessAccount();
        if (existingAccount) {
          console.log("Using existing account");
          navigate("/dashboard");
          return;
        }

        console.log("Initializing Aptos keyless account...");
        const { keylessAccount, userInfo } = await initializeAptosKeyless(
          id_token
        );

        // 4. Store session data
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        localStorage.setItem(
          "accountAddress",
          keylessAccount.accountAddress.toString()
        );
        localStorage.setItem("isAuthenticated", "true");

        navigate("/dashboard");
      } catch (err) {
        console.error("Authentication error:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");
        setTimeout(() => navigate("/"), 5000);
      }
    };

    handleCallback();
  }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
    </div>
  );
}
