import { jsx as _jsx } from "react/jsx-runtime";
import DataLabel from "./Features/DataLabel";
import Review from "./Features/Review";
import Store from "./Features/Store";
import Survey from "./Features/Survey";
export const FeatureContent = ({ feature }) => {
    const getContent = () => {
        switch (feature) {
            case "reviews":
                return _jsx(Review, {});
            case "surveys":
                return _jsx(Survey, {});
            case "labelling":
                return _jsx(DataLabel, {});
            case "store":
                return _jsx(Store, {});
            default:
                return null;
        }
    };
    return _jsx("div", { className: "mt-6", children: getContent() });
};
