import { Link } from "react-router-dom";
import Logo from "../ui/Logo";

export default function Navbar() {
  return (
    <nav className="top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/">
            <Logo size="lg" className="scale-200" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
