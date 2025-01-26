import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initializeAptosKeyless } from "../../lib/auth";
import { getLocalKeylessAccount } from "../../lib/keyless";
import { Loader2 } from "lucide-react";
export default function Callback() {
    const navigate = useNavigate();
    const [_error, setError] = useState(null);
    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get ID token from URL query params
                const params = new URLSearchParams(window.location.search);
                const id_token = params.get("id_token");
                if (!id_token)
                    throw new Error("Missing ID token");
                // Existing Aptos initialization logic
                const existingAccount = getLocalKeylessAccount();
                if (existingAccount) {
                    console.log("Using existing account");
                    navigate("/dashboard");
                    return;
                }
                console.log("Initializing Aptos keyless account...");
                const { keylessAccount, userInfo } = await initializeAptosKeyless(id_token);
                // Store session data
                localStorage.setItem("userInfo", JSON.stringify(userInfo));
                localStorage.setItem("accountAddress", keylessAccount.accountAddress.toString());
                localStorage.setItem("isAuthenticated", "true");
                navigate("/dashboard");
            }
            catch (err) {
                console.error("Authentication error:", err);
                setError(err instanceof Error ? err.message : "Authentication failed");
                setTimeout(() => navigate("/"), 5000);
            }
        };
        handleCallback();
    }, [navigate]);
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-purple-500" }) }));
}
