export default function DataLabel() {
  return (
    <div className="relative">
      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50">
        <div className="text-center space-y-4 bg-white/5 p-8 rounded-lg backdrop-blur-md border border-white/10">
          <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-lg font-medium">
            Coming Soon
          </span>
          <p className="mt-2 p-5 text-gray-400 text-base max-w-md">
            This feature is under development.
          </p>
        </div>
      </div>

      {/* Background Content */}
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 h-100">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Data Labelling Tasks
        </h2>
        <p className="text-gray-300">
          Participate in data labelling bounties and earn rewards for your
          contributions.
        </p>
      </div>
    </div>
  );
}
