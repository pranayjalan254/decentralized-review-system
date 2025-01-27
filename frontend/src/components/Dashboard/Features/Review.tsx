import { useState, useEffect } from "react";
import {
  Search,
  Utensils,
  Hotel,
  Dumbbell,
  Loader2,
  Coffee,
  Star,
} from "lucide-react";
import { getBalance } from "../../../utils/balance";
import PlaceModal from "./PlaceModal";
import { getLocalKeylessAccount } from "../../../lib/keyless";
import { getAverageRating } from "../../../utils/blockchain";

interface PlaceResult {
  displayName: string;
  formattedAddress?: string;
  location?: { lat: number; lng: number };
  rating?: number;
}

interface CachedData {
  data: PlaceResult[];
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000;

export default function Review() {
  const [_balance, setBalance] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("restaurants");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cachedPlaces, setCachedPlaces] = useState<Record<string, CachedData>>(
    {}
  );
  const [placeRatings, setPlaceRatings] = useState<{ [key: string]: number }>(
    {}
  );

  const categories = [
    {
      id: "restaurants",
      label: "Restaurants",
      icon: Utensils,
      type: "restaurant",
    },
    {
      id: "hotels",
      label: "Hotels",
      icon: Hotel,
      type: "lodging",
    },
    {
      id: "gyms",
      label: "Gyms",
      icon: Dumbbell,
      type: "gym",
    },
    {
      id: "cafes",
      label: "Cafes",
      icon: Coffee,
      type: "cafe",
    },
  ];

  const account = getLocalKeylessAccount();
  const accountAddress = account?.accountAddress.toString();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          throw new Error("Error getting location");
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      getNearbyPlaces();
    }
  }, [userLocation, selectedCategory]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (accountAddress) {
        try {
          const currentBalance = await getBalance(accountAddress);
          setBalance(currentBalance);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
    const intervalId = setInterval(fetchBalance, 30000);

    return () => clearInterval(intervalId);
  }, [accountAddress]);

  const getCachedData = (key: string): PlaceResult[] | null => {
    const cached = cachedPlaces[key];
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > CACHE_DURATION) {
      return null;
    }

    return cached.data;
  };

  const setCacheData = (key: string, data: PlaceResult[]) => {
    setCachedPlaces((prev) => ({
      ...prev,
      [key]: { data, timestamp: Date.now() },
    }));
  };

  const getNearbyPlaces = async () => {
    if (!userLocation) return;

    const cacheKey = `${selectedCategory}-${userLocation.lat}-${userLocation.lng}`;
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      setSearchResults(cachedData);
      return;
    }

    setLoading(true);
    try {
      const { Place, SearchNearbyRankPreference } =
        (await google.maps.importLibrary(
          "places"
        )) as google.maps.PlacesLibrary;

      const selectedType = categories.find(
        (cat) => cat.id === selectedCategory
      )?.type;

      const request = {
        fields: ["displayName", "location", "formattedAddress", "rating"],
        locationRestriction: {
          center: userLocation,
          radius: 2000,
        },
        includedPrimaryTypes: [selectedType],
        maxResultCount: 9,
        rankPreference: SearchNearbyRankPreference.POPULARITY,
        language: "en-US",
      };

      //@ts-ignore
      const { places } = await Place.searchNearby(request);
      //@ts-ignore
      setSearchResults(places);
      //@ts-ignore
      setCacheData(cacheKey, places);
    } catch (error) {
      console.error("Error fetching nearby places:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      getNearbyPlaces();
      return;
    }

    setLoading(true);
    try {
      const { Place } = (await google.maps.importLibrary(
        "places"
      )) as google.maps.PlacesLibrary;

      const selectedType = categories.find(
        (cat) => cat.id === selectedCategory
      )?.type;

      const request = {
        textQuery: `${searchQuery} ${selectedCategory} in`,
        fields: [
          "displayName",
          "location",
          "formattedAddress",
          "rating",
          "types",
        ],
        includedType: selectedType,
      };

      //@ts-ignore
      const { places } = await Place.searchByText(request);
      //@ts-ignore
      setSearchResults(places);
    } catch (error) {
      console.error("Error searching places:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (placeLocation: any) => {
    if (!userLocation || !placeLocation) return null;

    const R = 6371;
    const lat1 = userLocation.lat;
    const lon1 = userLocation.lng;
    const lat2 =
      typeof placeLocation.lat === "function"
        ? placeLocation.lat()
        : placeLocation.lat;
    const lon2 =
      typeof placeLocation.lng === "function"
        ? placeLocation.lng()
        : placeLocation.lng;

    if (typeof lat2 !== "number" || typeof lon2 !== "number") return null;

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

  const handleReviewSubmit = async () => {
    if (accountAddress) {
      const newBalance = await getBalance(accountAddress);
      setBalance(newBalance);
    }
  };

  useEffect(() => {
    const fetchRatings = async () => {
      const ratings: { [key: string]: number } = {};
      for (const place of searchResults) {
        if (place.displayName) {
          const rating = await getAverageRating(place.displayName);
          ratings[place.displayName] = rating;
        }
      }
      setPlaceRatings(ratings);
    };

    if (searchResults.length > 0) {
      fetchRatings();
    }
  }, [searchResults]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-6 text-white">
          Reviews & Ratings
        </h2>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              <category.icon className="w-5 h-5" />
              {category.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search places or leave empty for nearby..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : (
        searchResults.length > 0 && (
          <div>
            <h2 className="pb-4">Nearby Places...</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {searchResults.map((place, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedPlace(place);
                    setIsModalOpen(true);
                  }}
                  className="group bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 h-[180px] relative cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="h-[120px] space-y-2">
                    <h3 className="text-white font-semibold text-lg line-clamp-1">
                      {place.displayName}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {place.formattedAddress}
                    </p>
                    {placeRatings[place.displayName] > 0 && (
                      <div className="flex items-center gap-1">
                        <Star
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                        />
                        <span className="text-yellow-400">
                          {placeRatings[place.displayName].toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-4 inset-x-4 flex justify-between items-center">
                    {calculateDistance(place.location) && (
                      <span className="text-sm text-gray-400">
                        {calculateDistance(place.location)} km away
                      </span>
                    )}
                    <span className="text-sm text-purple-400 group-hover:text-purple-300 transition-colors">
                      View details →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      <PlaceModal
        place={selectedPlace}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlace(null);
        }}
        onReviewSubmit={handleReviewSubmit}
        // @ts-ignore
        userLocation={userLocation}
      />
    </div>
  );
}
