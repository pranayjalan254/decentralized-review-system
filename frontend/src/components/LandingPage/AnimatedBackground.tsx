import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 bg-white rounded-full opacity-30"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0.8, 0.3],
            y: ["0vh", "100vh"],
          }}
          initial={{ x: `${Math.random() * 100}vw`, y: -10 }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
