export default function Footer() {
  return (
    <footer className="py-6 md:py-8 bg-black/20 backdrop-blur-sm border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">TrueScore</span>
            <span className="text-gray-400 text-sm">© 2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
