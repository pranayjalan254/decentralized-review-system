import { motion } from "framer-motion";
import { Shield, Star, Users } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
      <div className="relative container mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold text-white mb-8">
            Trust in Reviews,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              Powered by Blockchain
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            A decentralized platform where authentic reviews meet rewards,
            powered by AI and community governance.
          </p>

          <motion.div
            className="flex justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              Connect Wallet
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-white/20 transition-all">
              Continue with Google
            </button>
          </motion.div>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="w-12 h-12 text-purple-400 mb-4" />}
            title="Soulbound Tokens"
            description="Earn non-transferable tokens for verified reviews, proving your contributions on-chain."
            delay={0.5}
            direction="left"
          />

          <FeatureCard
            icon={<Star className="w-12 h-12 text-yellow-400 mb-4" />}
            title="AI-Powered Validation"
            description="Advanced AI systems detect and prevent fraudulent reviews in real-time."
            delay={0.7}
            direction="up"
          />

          <FeatureCard
            icon={<Users className="w-12 h-12 text-green-400 mb-4" />}
            title="Community Governance"
            description="Be part of the decision-making process through our DAO structure."
            delay={0.9}
            direction="right"
          />
        </div>

        <div className="trust-score absolute top-1/2 right-10 transform -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">98%</div>
            <div className="text-sm text-white/80">Trust Score</div>
          </div>
        </div>
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
      className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl"
    >
      {icon}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
}
