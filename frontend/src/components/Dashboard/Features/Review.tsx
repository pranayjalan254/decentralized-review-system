import { useState } from "react";
import { Search, HotelIcon, Hotel, Dumbbell } from "lucide-react";

export default function Review() {
  const [selectedCategory, setSelectedCategory] = useState("restaurants");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const categories = [
    { id: "restaurants", label: "Restaurants", icon: HotelIcon },
    { id: "hotels", label: "Hotels", icon: Hotel },
    { id: "gyms", label: "Gyms", icon: Dumbbell },
  ];

  const handleSearch = async () => {
    try {
      const { Place } = (await google.maps.importLibrary(
        "places"
      )) as google.maps.PlacesLibrary;

      const request = {
        textQuery: `${searchQuery} ${selectedCategory} in`,
        fields: ["displayName", "location", "formattedAddress", "rating"],
      };

      //@ts-ignore
      const { places } = await Place.searchByText(request);
      setSearchResults(places);
    } catch (error) {
      console.error("Error searching places:", error);
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
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((place, index) => (
            <div
              key={index}
              className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10"
            >
              <h3 className="text-white font-semibold mb-2">
                {place.displayName}
              </h3>
              <p className="text-gray-300 text-sm mb-2">
                {place.formattedAddress}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
