import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Team() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A diverse group of experts passionate about blockchain, AI, and
            creating a trustworthy review ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6 px-4 md:px-0">
          <TeamMember
            name="Pranay Jalan"
            role="Full stack dev"
            image="./pranay.jpg"
            delay={0.3}
          />

          <TeamMember
            name="Anmol Agrawal"
            role="Smart Contract Dev"
            image="./anmol.jpg"
            delay={0.5}
          />

          <TeamMember
            name="Ansh Nohria"
            role="Smart contract dev"
            image="./ansh.jpg"
            delay={0.7}
          />
        </div>
      </div>
    </section>
  );
}

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  delay: number;
}

function TeamMember({ name, role, image, delay }: TeamMemberProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className="text-center p-4"
    >
      <div className="relative mb-6 group w-fit mx-auto">
        <img
          src={image}
          alt={name}
          className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2 md:gap-4 bg-black/50 p-2 rounded-full backdrop-blur-sm">
            <SocialLink
              icon={<Twitter className="w-4 h-4 md:w-5 md:h-5" />}
              href="#"
            />
            <SocialLink
              icon={<Linkedin className="w-4 h-4 md:w-5 md:h-5" />}
              href="#"
            />
            <SocialLink
              icon={<Github className="w-4 h-4 md:w-5 md:h-5" />}
              href="#"
            />
          </div>
        </div>
      </div>
      <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
        {name}
      </h3>
      <p className="text-gray-300">{role}</p>
    </motion.div>
  );
}

function SocialLink({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="bg-white/10 p-1.5 md:p-2 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors duration-300"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
}
