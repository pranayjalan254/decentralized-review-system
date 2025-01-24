import { motion } from "framer-motion";
import { ClipboardCheck, BarChart3, Target } from "lucide-react";

export default function Features() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Our Platform Features
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover how our platform revolutionizes the way people interact
            with businesses and earn rewards.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureBlock
            icon={<ClipboardCheck className="w-16 h-16 text-purple-500" />}
            title="Verified Reviews"
            description="Leave authentic reviews for places you've visited, verified through ZK proofs and location data."
            delay={0.3}
          />

          <FeatureBlock
            icon={<BarChart3 className="w-16 h-16 text-pink-500" />}
            title="Business Surveys"
            description="Businesses can create targeted surveys and reward participants with tokens for valuable feedback."
            delay={0.5}
          />

          <FeatureBlock
            icon={<Target className="w-16 h-16 text-blue-500" />}
            title="Data Labeling"
            description="Earn rewards by participating in data labeling tasks with customizable bounties."
            delay={0.7}
          />
        </div>
      </div>
    </section>
  );
}

interface FeatureBlockProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureBlock({ icon, title, description, delay }: FeatureBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm"
    >
      <div className="flex justify-center mb-6">{icon}</div>
      <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
}
