interface FeatureContentProps {
  feature: string;
}

export const FeatureContent = ({ feature }: FeatureContentProps) => {
  const getContent = () => {
    switch (feature) {
      case "reviews":
        return (
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Reviews & Ratings
            </h2>
            <p className="text-gray-300">
              Rate and review places you've visited. Your contributions help
              others make informed decisions.
            </p>
          </div>
        );
      case "surveys":
        return (
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Available Surveys
            </h2>
            <p className="text-gray-300">
              Complete surveys from businesses and earn tokens. Your feedback
              shapes better services.
            </p>
          </div>
        );
      case "labelling":
        return (
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Data Labelling Tasks
            </h2>
            <p className="text-gray-300">
              Participate in data labelling bounties and earn rewards for your
              contributions.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="mt-6">{getContent()}</div>;
};
