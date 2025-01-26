import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
export default function AnimatedBackground() {
    return (_jsx("div", { className: "fixed inset-0 pointer-events-none", children: [...Array(20)].map((_, i) => (_jsx(motion.div, { className: "absolute h-2 w-2 bg-white rounded-full opacity-30", animate: {
                scale: [1, 2, 1],
                opacity: [0.3, 0.8, 0.3],
                y: ["0vh", "100vh"],
            }, initial: { x: `${Math.random() * 100}vw`, y: -10 }, transition: {
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
            } }, i))) }));
}
