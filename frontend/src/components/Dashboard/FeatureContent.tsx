import DataLabel from "./Features/DataLabel";
import Review from "./Features/Review";
import Store from "./Features/Store";
import Survey from "./Features/Survey";

interface FeatureContentProps {
  feature: string;
}

export const FeatureContent = ({ feature }: FeatureContentProps) => {
  const getContent = () => {
    switch (feature) {
      case "reviews":
        return <Review />;
      case "surveys":
        return <Survey />;
      case "labelling":
        return <DataLabel />;
      case "store":
        return <Store />;
      default:
        return null;
    }
  };

  return <div className="mt-6">{getContent()}</div>;
};
