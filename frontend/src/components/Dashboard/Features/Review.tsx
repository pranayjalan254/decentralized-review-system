import { useState, useEffect } from "react";
import { Search, Utensils, Hotel, Dumbbell, Loader2 } from "lucide-react";
import PlaceModal from "./PlaceModal";

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

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function Review() {
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
  ];

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

  const getCachedData = (key: string): PlaceResult[] | null => {
    const cached = cachedPlaces[key];
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > CACHE_DURATION) {
      // Cache expired
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

  return (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-6 text-white">
          Reviews & Ratings
        </h2>

        {/* Categories */}
        <div className="flex gap-4 mb-6">
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
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search places or leave empty for nearby..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((place, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedPlace(place);
                    setIsModalOpen(true);
                  }}
                  className="group bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 h-[180px] relative cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="space-y-2">
                    <h3 className="text-white font-semibold text-lg line-clamp-1">
                      {place.displayName}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {place.formattedAddress}
                    </p>
                  </div>
                  <span className="absolute bottom-4 right-4 text-sm text-purple-400 group-hover:text-purple-300 transition-colors">
                    View details →
                  </span>
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
      />
    </div>
  );
}
