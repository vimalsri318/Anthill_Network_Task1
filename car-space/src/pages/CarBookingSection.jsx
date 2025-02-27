import { useState, useEffect } from "react";
import sec from "/src/assets/Screenshot 2025-02-23 at 10.03.05 PM.png";

const CarBookingSection = ({ cars = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState("new");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState(5000);
  const [filteredCars, setFilteredCars] = useState([]);

  useEffect(() => {
    // Create a safe cars array to work with
    const carsArray = Array.isArray(cars) ? cars : [];
    
    const filtered = carsArray.filter(
      (car) =>
        car.category === selectedCategory &&
        car.name && car.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        car.price <= priceRange
    );
    setFilteredCars(filtered);
  }, [selectedCategory, searchTerm, priceRange, cars]);

  return (
    <div>
      <div
        className="h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://s3-alpha-sig.figma.com/img/f579/90ac/8256764f240b4d7b829db8090b9c7732?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=p-dq3v44cAJh4ss5ASPIsglsWGxL1ToF9WP6u~aRyiQUoU0ZT8H0BIcXAXNqLlhWtd4ng2wd9OEmZGXGOVq4hk~9xezuyDRp8ltCkbwBpe8U4KJzznSQ8rW8KBLpRDvO9YW97ei8OH4rJcgsvTTMQmJQ2jy9D7B7cEFsd6WQSH743DFFmwS7CVpuQbq4IueE02PMGwTQ2SaWjjmKtLbt4DUJnz2A1RgSVsvA6tuQ2p9mKfNr-MNdoy6Qbs9xJAxwmeHwUXEO9fKGRvF9~81bsRgVU97X65jDuOyd27LmLUjC5Nrbw7ZGMbXCtIVV5IMrtVwr78lW2OZjvlcKc5H5MQ__')",
        }}
      >
        <div className="w-1/2 text-left px-10 text-white">
          <h1 className="text-7xl font-bold mb-4 leading-relaxed">
            Find Quality-Assured Cars Tailored to Your Budget and Preferences
          </h1>
          <p className="text-lg mb-6 leading-relaxed">
            Browse a Wide Range of Certified Used Cars from Trusted Dealers and Private Sellers
          </p>
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 mb-6">
            Book My Car
          </button>
          <div className="flex items-center">
            <div className="text-yellow-400 flex space-x-1">
              <span className="text-xl">⭐⭐⭐⭐⭐</span>
            </div>
            <p className="ml-2 text-sm">Working with 50+ Happy Members</p>
          </div>
        </div>

        {/* Right Section - Car Filter */}
        <div className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-lg max-w-md">
          {/* Category Selection */}
          <div className="flex mb-6 bg-gray-100 p-2 rounded-lg">
            <button
              className={`w-1/2 py-2 font-semibold rounded-lg transition ${
                selectedCategory === "new" ? "bg-white text-black shadow-md" : "text-gray-500"
              }`}
              onClick={() => setSelectedCategory("new")}
            >
              New Cars
            </button>
            <button
              className={`w-1/2 py-2 font-semibold rounded-lg transition ${
                selectedCategory === "used" ? "bg-white text-black shadow-md" : "text-gray-500"
              }`}
              onClick={() => setSelectedCategory("used")}
            >
              Used Cars
            </button>
          </div>

          {/* Search by Car Name */}
          <input
            type="text"
            placeholder="Search by Car Name"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Price Range Filter */}
          <div className="mb-4">
            <input
              type="range"
              min="1000"
              max="5000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-black mt-2">
              <span>₹1,000</span>
              <span>₹{priceRange}</span>
            </div>
          </div>

          {/* Display Available Car Count */}
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg w-full text-lg shadow-md">
            {filteredCars.length} Cars Available
          </button>
        </div>
      </div>
      <div>
        <img src={sec} alt="Car Booking" />
      </div>
    </div>
  );
};

export default CarBookingSection;