import { jsx as _jsx } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import Logo from "../ui/Logo";
export default function Navbar() {
    return (_jsx("nav", { className: "top-0 left-0 right-0 z-50", children: _jsx("div", { className: "container mx-auto px-4 md:px-6", children: _jsx("div", { className: "flex items-center justify-between h-20", children: _jsx(Link, { to: "/", children: _jsx(Logo, { size: "lg", className: "scale-200" }) }) }) }) }));
}
