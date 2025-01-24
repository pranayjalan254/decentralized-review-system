import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-16 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-white font-bold text-xl mb-4">TrustChain</h3>
            <p className="text-gray-300">
              Revolutionizing the way people trust and verify online reviews
              through blockchain technology.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              <FooterLink href="#" text="Verified Reviews" />
              <FooterLink href="#" text="Business Surveys" />
              <FooterLink href="#" text="Data Labeling" />
              <FooterLink href="#" text="Token Rewards" />
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <FooterLink href="#" text="About Us" />
              <FooterLink href="#" text="Careers" />
              <FooterLink href="#" text="Blog" />
              <FooterLink href="#" text="Contact" />
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <FooterLink href="#" text="Privacy Policy" />
              <FooterLink href="#" text="Terms of Service" />
              <FooterLink href="#" text="Cookie Policy" />
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">
            © 2024 TrustChain. All rights reserved.
          </p>

          <div className="flex space-x-6">
            <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
            <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} />
            <SocialLink href="#" icon={<Github className="w-5 h-5" />} />
            <SocialLink href="#" icon={<Mail className="w-5 h-5" />} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, text }: { href: string; text: string }) {
  return (
    <li>
      <a
        href={href}
        className="text-gray-300 hover:text-white transition-colors duration-300"
      >
        {text}
      </a>
    </li>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-gray-300 hover:text-white transition-colors duration-300"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
}
