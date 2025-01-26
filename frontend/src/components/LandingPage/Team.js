import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
export default function Team() {
    const teamMembers = [
        {
            name: "Pranay Jalan",
            role: "Full Stack Developer",
            image: "./pranay.jpg",
            delay: 0.3,
            github: "https://github.com/pranayjalan254",
            linkedin: "https://www.linkedin.com/in/pranay-jalan254/",
            twitter: "https://x.com/pranaytwts",
        },
        {
            name: "Anmol Agrawal",
            role: "Smart Contract Developer",
            image: "./anmol.jpg",
            delay: 0.5,
            github: "https://github.com/anmolagr39",
            linkedin: "https://www.linkedin.com/in/anmol-agrawal-aa62381b9/",
            twitter: "https://twitter.com/anmolagrawal",
        },
        {
            name: "Ansh Nohria",
            role: "Smart Contract Developer",
            image: "./ansh.jpg",
            delay: 0.7,
            github: "https://github.com/AnshNohria",
            linkedin: "https://www.linkedin.com/in/ansh-nohria/",
            twitter: "https://twitter.com/anshnohria",
        },
    ];
    return (_jsx("section", { className: "py-12", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, className: "text-center mb-8", children: [_jsx("h2", { className: "text-3xl font-bold text-white mb-2", children: "Meet Our Team" }), _jsx("p", { className: "text-lg text-gray-300 max-w-2xl mx-auto", children: "A team of passionate developers working together." })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto", children: teamMembers.map((member) => (_jsx(TeamMember, { ...member }, member.name))) })] }) }));
}
function TeamMember({ name, role, image, delay, github, linkedin, twitter, }) {
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { delay, duration: 0.8 }, className: "text-center p-3", children: [_jsxs("div", { className: "relative mb-4 group w-fit mx-auto", children: [_jsx("img", { src: image, alt: name, className: "w-28 h-28 md:w-40 md:h-40 rounded-full object-cover transition-transform duration-300 group-hover:scale-105" }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: _jsxs("div", { className: "flex gap-2 bg-black/50 p-2 rounded-full backdrop-blur-sm", children: [twitter && (_jsx(SocialLink, { icon: _jsx(Twitter, { className: "w-4 h-4" }), href: twitter, label: "Twitter" })), linkedin && (_jsx(SocialLink, { icon: _jsx(Linkedin, { className: "w-4 h-4" }), href: linkedin, label: "LinkedIn" })), github && (_jsx(SocialLink, { icon: _jsx(Github, { className: "w-4 h-4" }), href: github, label: "GitHub" }))] }) })] }), _jsx("h3", { className: "text-lg font-semibold text-white mb-1", children: name }), _jsx("p", { className: "text-sm text-gray-300", children: role })] }));
}
function SocialLink({ icon, href, label, }) {
    return (_jsx("a", { href: href, className: "bg-white/10 p-2 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110", target: "_blank", rel: "noopener noreferrer", title: label, children: icon }));
}
