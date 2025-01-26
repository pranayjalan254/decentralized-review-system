interface PlaceModalProps {
    place: any;
    isOpen: boolean;
    onClose: () => void;
    onReviewSubmit: () => void;
    userLocation: {
        lat: number;
        lng: number;
    } | null;
}
export default function PlaceModal({ place, isOpen, onClose, onReviewSubmit, userLocation, }: PlaceModalProps): import("react/jsx-runtime").JSX.Element | null;
export {};
