export default function Review() {
  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Reviews & Ratings
      </h2>
      <p className="text-gray-300">
        Rate and review places you've visited. Your contributions help others
        make informed decisions.
      </p>
    </div>
  );
}
const request = {
  textQuery: "Tacos in Mountain View",
  fields: ["displayName", "location", "businessStatus"],
  isOpenNow: true,
  language: "en-US",
  maxResultCount: 8,
};

//@ts-ignore
const { places } = await Place.searchByText(request);
