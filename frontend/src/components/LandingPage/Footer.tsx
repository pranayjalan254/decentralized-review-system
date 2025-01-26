export default function Footer() {
  return (
    <footer className="py-12 md:py-16 bg-black/20 backdrop-blur-sm border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="TrueScore Logo"
              className="h-120 w-auto"
            />
          </div>
          <span className="text-gray-400 text-base">
            © 2025 All rights reserved
          </span>
        </div>
      </div>
    </footer>
  );
}
