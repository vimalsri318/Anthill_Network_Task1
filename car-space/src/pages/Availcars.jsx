import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const Availcars = () => {
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState(1000000); // Default high value to show all cars
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [visibleCars, setVisibleCars] = useState(9); // Initially show 9 cars
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("User Info:", currentUser);

        if (!currentUser.photoURL) {
          try {
            await updateProfile(currentUser, {
              photoURL:
                "https://pbs.twimg.com/profile_images/1525649141296074752/50-ylSJG_400x400.jpg",
            });
            console.log("Profile updated successfully!");
          } catch (error) {
            console.error("Error updating profile:", error);
          }
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cars"));
        const carsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCars(carsData);
        setFilteredCars(carsData);
        
        // Set initial price range to max price in database + 10%
        const maxPrice = Math.max(...carsData.map(car => parseFloat(car.price.replace(/[₹,]/g, ""))), 1000000);
        setPriceRange(maxPrice);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  // Filter cars based on search term and price range
  useEffect(() => {
    if (cars.length > 0) {
      const results = cars.filter(car => {
        // Convert price string to number for comparison (remove ₹ and commas)
        const carPriceNumber = parseFloat(car.price.replace(/[₹,]/g, ""));
        
        // Check if car name matches search term and price is within range
        return car.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
               carPriceNumber <= priceRange;
      });
      
      setFilteredCars(results);
      // Reset visible cars count when filters change
      setVisibleCars(9);
    }
  }, [searchTerm, priceRange, cars]);

  // Auto-hide alert after 4 seconds
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
  };

  const handleBuyNow = async (car) => {
    if (!user) {
      showAlert("Please login to buy a car", "error");
      return;
    }

    try {
      await addDoc(collection(db, "buyRequests"), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || "Unknown User",
        carId: car.id,
        carName: car.name,
        carPrice: car.price,
        carImage: car.image,
        status: "Pending",
      });

      showAlert("Buy request sent successfully!");
    } catch (error) {
      console.error("Error sending buy request:", error);
      showAlert("Failed to send request. Try again.", "error");
    }
  };

  // Get max price for range slider
  const getMaxPrice = () => {
    if (cars.length === 0) return 1000000;
    const maxPrice = Math.max(...cars.map(car => {
      // Handle prices formatted as strings (e.g., "₹50,000")
      return parseFloat(car.price.replace(/[₹,]/g, ""));
    }));
    return maxPrice;
  };

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Handle View More button click
  const handleViewMore = () => {
    setVisibleCars(filteredCars.length); // Show all cars
  };

  // Custom Alert Component
  const Alert = ({ message, type }) => {
    const bgColor = type === "error" ? "bg-red-100 border-red-500" : "bg-green-100 border-green-500";
    const textColor = type === "error" ? "text-red-700" : "text-green-700";
    const icon = type === "error" ? "❌" : "✅";
    
    return (
      <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg 
                     ${bgColor} border-l-4 transition-all duration-500 flex items-center max-w-md w-full`}>
        <span className="text-2xl mr-3">{icon}</span>
        <p className={`${textColor} font-medium`}>{message}</p>
      </div>
    );
  };

  // Get currently visible cars
  const currentlyVisibleCars = filteredCars.slice(0, visibleCars);
  
  // Determine if View More button should be shown
  const shouldShowViewMore = filteredCars.length > visibleCars;

  return (
    <div style={{ backgroundColor: "rgba(255, 252, 252, 1)" }} className="min-h-screen pt-20 relative">
      {/* Render the alert if show is true */}
      {alert.show && <Alert message={alert.message} type={alert.type} />}
      
      <div className="p-6 w-full max-w-screen-xl mx-auto">
        <h2 className="text-5xl font-extrabold text-center my-8 text-gray-900 tracking-wide">
          Available Cars for Sale
        </h2>
        
        {/* Search and Filter Section */}
        <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for cars by name..."
                className="pl-12 pr-4 py-3 w-full rounded-lg border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Price Range Filter */}
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2">
                Price Range: {formatPrice(priceRange)}
              </label>
              <input
                type="range"
                min="0"
                max={getMaxPrice()}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>₹0</span>
                <span>{formatPrice(getMaxPrice())}</span>
              </div>
            </div>
          </div>
          
          {/* Search Results Count */}
          <div className="mt-4 text-gray-700 font-medium">
            {filteredCars.length} cars found
            {shouldShowViewMore && ` (showing ${currentlyVisibleCars.length})`}
          </div>
        </div>
  
        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentlyVisibleCars.length > 0 ? (
            currentlyVisibleCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
              >
                {/* Car Image with Overlay Effect */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  
                  {/* Top badge */}
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Premium
                  </div>
                </div>

                {/* Car Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{car.name}</h3>
                    <span className="text-2xl font-bold text-blue-600">{car.price}</span>
                  </div>
                  
                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-2 my-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3a1 1 0 00.8-.4l3-4a1 1 0 00.2-.6V8a1 1 0 00-1-1h-3.4a1 1 0 00-.8.4L11.2 10H8V5a1 1 0 00-1-1H3z" />
                      </svg>
                      2022 Model
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      Automatic
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      15,000 km
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                      Petrol
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">{car.description}</p>
                  
                  {/* Features Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">Bluetooth</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">AC</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">Airbags</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-5">
                    <button
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-3 rounded-lg font-medium 
                                shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      onClick={() => handleBuyNow(car)}
                    >
                      Buy Now
                    </button>
                    <button className="bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <div className="inline-block p-6 bg-blue-50 rounded-full mb-4">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p className="text-gray-700 text-xl font-medium">No cars match your search criteria</p>
              <p className="text-gray-500 mt-2">Try adjusting your search or price range</p>
              <button 
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => {
                  setSearchTerm("");
                  setPriceRange(getMaxPrice());
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
        
        {/* View More Button */}
        {shouldShowViewMore && (
          <div className="mt-10 text-center">
            <button 
              onClick={handleViewMore}
              className="bg-white text-blue-600 border border-blue-500 hover:bg-blue-50 font-medium px-8 py-3 rounded-lg shadow-sm 
                        transition-all duration-300 hover:shadow-md flex items-center mx-auto"
            >
              <span>View All Cars</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Availcars;