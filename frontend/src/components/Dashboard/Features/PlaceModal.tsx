import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MapPin, Flag, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Review } from "../../../types/place";

interface PlaceModalProps {
  place: any;
  isOpen: boolean;
  onClose: () => void;
  userLocation?: { lat: number; lng: number };
}

export const PlaceModal = ({
  place,
  isOpen,
  onClose,
  userLocation,
}: PlaceModalProps) => {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, content: "" });

  // Mock data - replace with actual data from your backend
  const mockReviews: Review[] = [
    {
      id: "1",
      author: "Jane Doe",
      rating: 4,
      content: "Great place! Highly recommend.",
      createdAt: new Date("2024-01-15"),
      helpful: 12,
    },
  ];

  if (!place) return null;

  const calculateDistance = () => {
    if (!userLocation || !place.location) return null;

    const R = 6371;
    const lat1 = userLocation.lat;
    const lon1 = userLocation.lng;
    const lat2 =
      typeof place.location.lat === "function"
        ? place.location.lat()
        : place.location.lat;
    const lon2 =
      typeof place.location.lng === "function"
        ? place.location.lng()
        : place.location.lng;

    if (typeof lat2 !== "number" || typeof lon2 !== "number") {
      console.error("Invalid location data:", { lat2, lon2 });
      return null;
    }

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-2xl bg-gray-900/90 backdrop-blur-md rounded-lg border border-white/10 z-50 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-white/10">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-white pr-8">
                {place.displayName}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                {place.rating && (
                  <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded">
                    <Star
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                    />
                    <span className="text-yellow-400">{place.rating}</span>
                  </div>
                )}
                {calculateDistance() && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{calculateDistance()} km away</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <div className="mb-6">
                <h3 className="text-sm text-gray-400 mb-1">Address</h3>
                <p className="text-white">{place.formattedAddress}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                {!isWritingReview ? (
                  <button
                    onClick={() => setIsWritingReview(true)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                  >
                    Write a Review
                  </button>
                ) : (
                  <div className="space-y-4 bg-white/5 p-4 rounded-lg">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            setNewReview((prev) => ({ ...prev, rating: star }))
                          }
                          className={`p-1 ${
                            star <= newReview.rating
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                        >
                          <Star
                            className="w-6 h-6"
                            fill={
                              star <= newReview.rating ? "currentColor" : "none"
                            }
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={newReview.content}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      placeholder="Write your review..."
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsWritingReview(false)}
                        className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          // Handle submit review
                          setIsWritingReview(false);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                      >
                        Submit Review
                      </button>
                    </div>
                  </div>
                )}
                <button
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white font-semibold transition-all flex items-center gap-2"
                  title="Report this place"
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <h3 className="text-xl font-semibold text-white">Reviews</h3>
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white/5 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">
                              {review.author}
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-600"
                                  }`}
                                  fill="currentColor"
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <button className="flex items-center gap-1 text-gray-400 hover:text-purple-400">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">{review.helpful}</span>
                        </button>
                      </div>
                      <p className="text-gray-300">{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PlaceModal;
