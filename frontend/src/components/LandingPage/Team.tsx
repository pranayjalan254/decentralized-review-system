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

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Meet Our Team</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            A team of passionate developers working together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <TeamMember key={member.name} {...member} />
          ))}
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
  github?: string;
  linkedin?: string;
  twitter?: string;
}

function TeamMember({
  name,
  role,
  image,
  delay,
  github,
  linkedin,
  twitter,
}: TeamMemberProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className="text-center p-3"
    >
      <div className="relative mb-4 group w-fit mx-auto">
        <img
          src={image}
          alt={name}
          className="w-28 h-28 md:w-40 md:h-40 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2 bg-black/50 p-2 rounded-full backdrop-blur-sm">
            {twitter && (
              <SocialLink
                icon={<Twitter className="w-4 h-4" />}
                href={twitter}
                label="Twitter"
              />
            )}
            {linkedin && (
              <SocialLink
                icon={<Linkedin className="w-4 h-4" />}
                href={linkedin}
                label="LinkedIn"
              />
            )}
            {github && (
              <SocialLink
                icon={<Github className="w-4 h-4" />}
                href={github}
                label="GitHub"
              />
            )}
          </div>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
      <p className="text-sm text-gray-300">{role}</p>
    </motion.div>
  );
}

function SocialLink({
  icon,
  href,
  label,
}: {
  icon: React.ReactNode;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="bg-white/10 p-2 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110"
      target="_blank"
      rel="noopener noreferrer"
      title={label}
    >
      {icon}
    </a>
  );
}
