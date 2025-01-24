import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Review } from "../../../types/place";

interface PlaceModalProps {
  place: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlaceModal({
  place,
  isOpen,
  onClose,
}: PlaceModalProps) {
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
    // Add more mock reviews...
  ];

  const averageRating = 4.2; // Replace with actual calculation
  const totalReviews = mockReviews.length;

  if (!place) return null;

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-4 md:inset-10 bg-gray-900/90 backdrop-blur-md rounded-lg border border-white/10 z-50 overflow-auto"
          >
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-md p-4 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {place.displayName}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Place Info */}
              <div className="space-y-4">
                <p className="text-gray-300">{place.formattedAddress}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-purple-500/10 px-3 py-2 rounded-lg">
                    <Star
                      className="w-5 h-5 text-purple-400 mr-2"
                      fill="currentColor"
                    />
                    <span className="text-purple-400 font-semibold">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-400">{totalReviews} reviews</span>
                </div>
              </div>

              {/* Write Review Section */}
              {!isWritingReview ? (
                <button
                  onClick={() => setIsWritingReview(true)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
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

              {/* Reviews List */}
              <div className="space-y-6">
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
}
