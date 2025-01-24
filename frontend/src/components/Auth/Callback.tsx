import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseJWTFromURL, initializeAptosKeyless } from "../../lib/auth";
import { Loader2 } from "lucide-react";

export default function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const jwt = parseJWTFromURL(window.location.href);
        if (!jwt) {
          console.error("Failed to parse JWT from URL:", window.location.href);
          throw new Error("Authentication failed - No token received");
        }

        console.log("Initializing Aptos keyless account...");
        const { keylessAccount, userInfo } = await initializeAptosKeyless(jwt);

        console.log(
          "Account created:",
          keylessAccount.accountAddress.toString()
        );

        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        localStorage.setItem(
          "accountAddress",
          keylessAccount.accountAddress.toString()
        );
        localStorage.setItem("isAuthenticated", "true");

        navigate("/dashboard");
      } catch (err) {
        console.error("Full authentication error:", err);
        const errorMessage =
          err instanceof Error
            ? `Authentication failed: ${err.message}`
            : "Authentication failed - Please try again";

        setError(errorMessage);
        setTimeout(() => navigate("/"), 5000);
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
    </div>
  );
}
