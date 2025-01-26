import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MapPin, Flag, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { submitReview, getReviewCount, getAllReviews, getAverageRating, } from "../../../utils/blockchain";
import { getLocalKeylessAccount } from "../../../lib/keyless";
const account = getLocalKeylessAccount();
const accountAddress = account?.accountAddress.toString();
export default function PlaceModal({ place, isOpen, onClose, onReviewSubmit, userLocation, }) {
    const [isWritingReview, setIsWritingReview] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 0, content: "" });
    const [reviewCount, setReviewCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    useEffect(() => {
        const fetchReviewsData = async () => {
            if (place?.displayName) {
                setIsLoadingReviews(true);
                try {
                    const [reviews, avgRating, count] = await Promise.all([
                        getAllReviews(place.displayName),
                        getAverageRating(place.displayName),
                        getReviewCount(place.displayName),
                    ]);
                    setReviews(reviews);
                    setAverageRating(avgRating);
                    setReviewCount(count);
                }
                catch (error) {
                    console.error("Error fetching reviews data:", error);
                }
                finally {
                    setIsLoadingReviews(false);
                }
            }
        };
        if (isOpen) {
            fetchReviewsData();
        }
    }, [isOpen, place?.displayName]);
    const handleReviewSubmit = async (reviewerAddress, establishmentName, rating, comment) => {
        if (!rating) {
            toast.error("Please select a rating");
            return;
        }
        if (!comment.trim()) {
            toast.error("Please write a review");
            return;
        }
        setIsSubmitting(true);
        try {
            await submitReview({
                reviewerAddress,
                establishmentName,
                rating,
                comment,
            });
            toast.success("Review submitted successfully! You earned 20 tokens!");
            setNewReview({ rating: 0, content: "" });
            setIsWritingReview(false);
            // Refresh review count
            const newCount = await getReviewCount(establishmentName);
            setReviewCount(newCount);
            // Call the token minting callback
            onReviewSubmit();
            // Close the modal or show success message
            onClose();
        }
        catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Failed to submit review. Please try again.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (!place)
        return null;
    const calculateDistance = () => {
        if (!userLocation || !place.location)
            return null;
        const R = 6371;
        const lat1 = userLocation.lat;
        const lon1 = userLocation.lng;
        const lat2 = typeof place.location.lat === "function"
            ? place.location.lat()
            : place.location.lat;
        const lon2 = typeof place.location.lng === "function"
            ? place.location.lng()
            : place.location.lng;
        if (typeof lat2 !== "number" || typeof lon2 !== "number") {
            console.error("Invalid location data:", { lat2, lon2 });
            return null;
        }
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance.toFixed(1);
    };
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose, className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50" }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 }, className: "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-2xl bg-gray-900/90 backdrop-blur-md rounded-lg border border-white/10 z-50 overflow-hidden max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "p-4 sm:p-6 border-b border-white/10", children: [_jsx("button", { onClick: onClose, className: "absolute right-4 top-4 text-gray-400 hover:text-white", children: _jsx(X, { className: "w-6 h-6" }) }), _jsx("h2", { className: "text-2xl font-bold text-white pr-8", children: place.displayName }), _jsxs("div", { className: "flex items-center gap-4 mt-2", children: [place.rating && (_jsxs("div", { className: "flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded", children: [_jsx(Star, { className: "w-4 h-4 text-yellow-400", fill: "currentColor" }), _jsx("span", { className: "text-yellow-400", children: place.rating })] })), calculateDistance() && (_jsxs("div", { className: "flex items-center gap-1 text-gray-400", children: [_jsx(MapPin, { className: "w-4 h-4" }), _jsxs("span", { children: [calculateDistance(), " km away"] })] }))] })] }), _jsxs("div", { className: "p-4 sm:p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-sm text-gray-400 mb-1", children: "Address" }), _jsx("p", { className: "text-white", children: place.formattedAddress })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-2 sm:gap-4", children: [!isWritingReview ? (_jsx("button", { onClick: () => setIsWritingReview(true), disabled: isSubmitting, className: "flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50", children: "Write a Review" })) : (_jsxs("div", { className: "w-full space-y-4 bg-white/5 p-4 rounded-lg", children: [_jsx("div", { className: "flex gap-2", children: [1, 2, 3, 4, 5].map((star) => (_jsx("button", { onClick: () => setNewReview((prev) => ({ ...prev, rating: star })), disabled: isSubmitting, className: `p-1 ${star <= newReview.rating
                                                            ? "text-yellow-400"
                                                            : "text-gray-400"} disabled:opacity-50`, children: _jsx(Star, { className: "w-6 h-6", fill: star <= newReview.rating ? "currentColor" : "none" }) }, star))) }), _jsx("textarea", { value: newReview.content, onChange: (e) => setNewReview((prev) => ({
                                                        ...prev,
                                                        content: e.target.value,
                                                    })), disabled: isSubmitting, placeholder: "Write your review...", className: "w-full min-h-[120px] bg-black/20 border border-white/10 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-y disabled:opacity-50", rows: 4 }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setIsWritingReview(false), disabled: isSubmitting, className: "px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all disabled:opacity-50", children: "Cancel" }), _jsx("button", { onClick: () => {
                                                                handleReviewSubmit(accountAddress || "", place.displayName || "", newReview.rating, newReview.content);
                                                            }, disabled: isSubmitting, className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin" }), "Submitting..."] })) : ("Submit Review") })] })] })), _jsx("button", { className: "px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white font-semibold transition-all flex items-center gap-2", title: "Report this place", children: _jsx(Flag, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "space-y-4 sm:space-y-6 mt-4 sm:mt-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-xl font-semibold text-white", children: "Reviews" }), _jsxs("div", { className: "flex items-center gap-4", children: [averageRating > 0 && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Star, { className: "w-4 h-4 text-yellow-400", fill: "currentColor" }), _jsx("span", { className: "text-white", children: averageRating.toFixed(1) })] })), _jsxs("span", { className: "text-sm text-gray-400", children: [reviewCount, " ", reviewCount === 1 ? "review" : "reviews", " ", "on chain"] })] })] }), isLoadingReviews ? (_jsx("div", { className: "flex justify-center py-8", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-purple-500" }) })) : (_jsx("div", { className: "space-y-4", children: reviews.length > 0 ? (reviews.map((review, index) => (_jsxs("div", { className: "bg-white/5 rounded-lg p-4 space-y-3", children: [_jsx("div", { className: "flex justify-between items-start", children: _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-white font-medium", children: [review.reviewer.slice(0, 6), "...", review.reviewer.slice(-4)] }), _jsx("div", { className: "flex", children: [...Array(5)].map((_, i) => (_jsx(Star, { className: `w-4 h-4 ${i < review.rating
                                                                                    ? "text-yellow-400"
                                                                                    : "text-gray-600"}`, fill: "currentColor" }, i))) })] }), _jsx("span", { className: "text-sm text-gray-400", children: new Date(review.timestamp / 1000).toLocaleDateString() })] }) }), _jsx("p", { className: "text-gray-300", children: review.comment })] }, index)))) : (_jsx("p", { className: "text-gray-400 text-center py-4", children: "No reviews yet" })) }))] })] })] })] })) }));
}
