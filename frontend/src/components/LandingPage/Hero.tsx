import { motion } from "framer-motion";
import { Shield, Star, Store } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import useEphemeralKeyPair from "../Auth/Auth";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleGoogleLogin = () => {
    const ekp = useEphemeralKeyPair();
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const loginUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: "http://localhost:5173/callback",
      response_type: "id_token",
      scope: "openid email profile",
      nonce: ekp.nonce,
      prompt: "consent",
      access_type: "offline",
    });

    window.location.href = `${loginUrl.toString()}?${params.toString()}`;
  };

  useGSAP(
    () => {
      gsap.from(".trust-score", {
        scale: 0,
        rotation: -180,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <div className="relative container mx-auto px-4 md:px-6 pt-10 md:pt-24 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-6xl mx-auto"
        >
          <div className="space-y-4 md:space-y-6 mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2 md:mb-4">
                TrueScore
              </h1>
              <p className="text-xl md:text-2xl font-medium text-gray-300">
                Where Trust Meets Technology
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4"
            >
              A revolutionary platform combining blockchain-verified reviews,
              AI-powered surveys, and community rewards to build a trustworthy
              ecosystem for businesses and users.
            </motion.p>

            <motion.div
              className="flex justify-center gap-6 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <button
                onClick={handleGoogleLogin}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                Continue with Google
              </button>
            </motion.div>
          </div>

          <div className="mt-16 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
            <FeatureCard
              icon={<Shield className="w-12 h-12 text-purple-400 mb-4" />}
              title="$TRUST Tokens"
              description="Earn non-transferable tokens for verified reviews, proving your contributions on-chain."
              delay={0.5}
              direction="left"
            />

            <FeatureCard
              icon={<Star className="w-12 h-12 text-yellow-400 mb-4" />}
              title="AI-Powered Surveys"
              description="AI-Tuned Surveys, Tailored to Your Business Needs."
              delay={0.7}
              direction="up"
            />

            <FeatureCard
              icon={<Store className="w-12 h-12 text-green-400 mb-4" />}
              title="Store"
              description="Earn Vouchers & Rewards by Exchanging $Trust."
              delay={0.9}
              direction="right"
            />
          </div>

          <div className="trust-score hidden md:flex absolute top-1/2 right-10 transform -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">98%</div>
              <div className="text-sm text-white/80">Trust Score</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  direction: "left" | "right" | "up";
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
  direction,
}: FeatureCardProps) {
  const getInitialX = () => {
    if (direction === "left") return -50;
    if (direction === "right") return 50;
    return 0;
  };

  const getInitialY = () => {
    if (direction === "up") return 50;
    return 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: getInitialX(), y: getInitialY() }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl flex flex-col items-center"
    >
      <div className="flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2 text-center">
        {title}
      </h3>
      <p className="text-gray-300 text-center">{description}</p>
    </motion.div>
  );
}
