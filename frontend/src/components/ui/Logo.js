import { jsx as _jsx } from "react/jsx-runtime";
export default function Logo({ className = "", size = "md" }) {
    const sizes = {
        sm: "h-6",
        md: "h-8",
        lg: "h-10",
    };
    return (_jsx("div", { className: `flex items-center gap-2 ${className}`, children: _jsx("img", { src: "/logo.png", alt: "TrueScore Logo", className: `${sizes[size]} w-auto object-contain` }) }));
}
