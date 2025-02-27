import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import { FaCar, FaPlus, FaTrash, FaEdit, FaCheck, FaList, FaClipboardList, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [cars, setCars] = useState([]);
  const [carData, setCarData] = useState({ name: "", price: "", image: "", description: "" });
  const [editingCarId, setEditingCarId] = useState(null);
  const [buyRequests, setBuyRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("manageCars");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeCars = onSnapshot(collection(db, "cars"), (snapshot) => {
      setCars(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeRequests = onSnapshot(collection(db, "buyRequests"), (snapshot) => {
      setBuyRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeCars();
      unsubscribeRequests();
    };
  }, []);

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
    // Scroll to top to ensure alert is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e) => {
    setCarData({ ...carData, [e.target.name]: e.target.value });
  };

  const handleAddCar = async () => {
    if (!carData.name || !carData.price || !carData.image || !carData.description) {
      showAlert("Please fill all fields", "error");
      return;
    }
    
    try {
      await addDoc(collection(db, "cars"), carData);
      setCarData({ name: "", price: "", image: "", description: "" });
      showAlert("Car added successfully!");
    } catch (error) {
      showAlert("Failed to add car: " + error.message, "error");
    }
  };

  const handleEditCar = (car) => {
    setCarData(car);
    setEditingCarId(car.id);
    showAlert("Editing car: " + car.name, "info");
  };

  const handleUpdateCar = async () => {
    if (!editingCarId) return;
    if (!carData.name || !carData.price || !carData.image || !carData.description) {
      showAlert("Please fill all fields", "error");
      return;
    }
    
    try {
      const carRef = doc(db, "cars", editingCarId);
      await updateDoc(carRef, carData);
      setEditingCarId(null);
      setCarData({ name: "", price: "", image: "", description: "" });
      showAlert("Car updated successfully!");
    } catch (error) {
      showAlert("Failed to update car: " + error.message, "error");
    }
  };

  const handleDeleteCar = async (id) => {
    try {
      await deleteDoc(doc(db, "cars", id));
      showAlert("Car deleted successfully!");
    } catch (error) {
      showAlert("Failed to delete car: " + error.message, "error");
    }
  };

  const handleApproveRequest = async (request) => {
    try {
      await addDoc(collection(db, "approved_requests"), request);
      await deleteDoc(doc(db, "buyRequests", request.id));
      showAlert(`Request for ${request.carName} approved!`);
    } catch (error) {
      showAlert("Failed to approve request: " + error.message, "error");
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      await deleteDoc(doc(db, "buyRequests", id));
      showAlert("Request deleted successfully!");
    } catch (error) {
      showAlert("Failed to delete request: " + error.message, "error");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      showAlert("Logged out successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      showAlert("Failed to logout: " + error.message, "error");
    }
  };

  // Custom Alert Component
  const Alert = ({ message, type }) => {
    const getAlertStyle = () => {
      switch (type) {
        case "error":
          return {
            container: "bg-red-100 border-red-500 text-red-800",
            icon: "❌"
          };
        case "success":
          return {
            container: "bg-green-100 border-green-500 text-green-800",
            icon: "✅"
          };
        case "info":
          return {
            container: "bg-blue-100 border-blue-500 text-blue-800",
            icon: "ℹ️"
          };
        default:
          return {
            container: "bg-blue-100 border-blue-500 text-blue-800",
            icon: "ℹ️"
          };
      }
    };

    const style = getAlertStyle();
    
    return (
      <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 
                     ${style.container} border-l-4 rounded-md px-4 py-3 shadow-md 
                     flex items-center space-x-2 min-w-80 max-w-md transition-all duration-300`}
           style={{animation: "slideDown 0.3s ease-out forwards"}}>
        <span className="text-xl flex-shrink-0">{style.icon}</span>
        <p className="font-medium">{message}</p>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Alert Component */}
      {alert.show && <Alert message={alert.message} type={alert.type} />}

      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-red-600 font-bold ml-6 text-4xl mb-6 items-center">Carspace</h2>
        
        <div className="mt-16 flex flex-col flex-grow space-y-3">
          <button 
            onClick={() => setActiveTab("manageCars")} 
            className={`w-full text-left py-3 px-4 rounded transition-all duration-200 flex items-center
                      ${activeTab === "manageCars" ? "bg-blue-600 text-white" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            <FaList className="mr-3" /> Manage Car List
          </button>
          
          <button 
            onClick={() => setActiveTab("buyRequests")} 
            className={`w-full text-left py-3 px-4 rounded transition-all duration-200 flex items-center
                      ${activeTab === "buyRequests" ? "bg-blue-600 text-white" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            <FaClipboardList className="mr-3" /> Buy Requests
          </button>
        </div>
        
        {/* Logout button at bottom of sidebar */}
        <button 
          onClick={handleLogout}
          className="w-full mt-auto text-left py-3 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-200 flex items-center"
        >
          <FaSignOutAlt className="mr-3" /> Logout
        </button>
      </aside>

      <main className="flex-1 p-6">
        {activeTab === "manageCars" && (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="ml-2">Add New Car</span>
            </h2>

            <div className="space-y-4 w-120 ml-110 border-non">
              <input
                type="text"
                name="name"
                value={carData.name}
                onChange={handleChange}
                placeholder="Enter car name"
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              
              <input
                type="text"
                name="price"
                value={carData.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              
              <input
                type="text"
                name="image"
                value={carData.image}
                onChange={handleChange}
                placeholder="Paste image URL"
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              
              <textarea
                name="description"
                value={carData.description}
                onChange={handleChange}
                placeholder="Enter car details..."
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows="4"
              ></textarea>
            </div>
            

            <button
              onClick={editingCarId ? handleUpdateCar : handleAddCar}
              className="w-120 ml-110 mt-6 p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            >
              {editingCarId ? (
                <>
                  <FaEdit className="mr-2" /> Update Car
                </>
              ) : (
                <>
                  <FaPlus className="mr-2" /> Add Car
                </>
              )}
            </button>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car) => (
                <div 
                  key={car.id} 
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl"
                >
                  <img 
                    src={car.image} 
                    alt={car.name} 
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800">{car.name}</h3>
                    <p className="text-lg text-gray-600 font-semibold mt-2">₹{car.price}</p>
                    <div className="flex justify-between mt-5">
                      <button 
                        onClick={() => handleEditCar(car)} 
                        className="bg-yellow-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition flex items-center"
                      >
                        <FaEdit className="mr-2" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteCar(car.id)} 
                        className="bg-red-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-600 transition flex items-center"
                      >
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "buyRequests" && (
          <div className="mt-10 max-w-5xl mx-auto bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-gray-200">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center justify-center gap-2">
              🛒 Buy Requests
            </h2>

            {buyRequests.length === 0 ? (
              <p className="text-center text-lg text-gray-500 font-medium">🚫 No buy requests found.</p>
            ) : (
              <div className="space-y-6">
                {buyRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className="p-6 border rounded-2xl shadow-lg flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Car Image Section */}
                    <div className="flex items-center gap-6">
                      <div className="w-36 h-24 overflow-hidden rounded-xl shadow-md border border-gray-300 bg-white">
                        {request.carImage ? (
                          <img
                            src={request.carImage}
                            alt="Car"
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm font-semibold">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Car Info */}
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-800">{request.carName || "New Car"}</h3>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">👤 Buyer:</span> {request.userName || request.userEmail}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">💰 Price:</span> ₹{request.carPrice}
                        </p>
                        <p className={`text-sm font-semibold mt-1 ${request.status === "Pending" ? "text-yellow-600" : "text-green-600"}`}>
                          🔄 Status: {request.status}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleApproveRequest(request)} 
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                      >
                        <FaCheck className="mr-1" /> Approve
                      </button>
                      <button 
                        onClick={() => handleDeleteRequest(request.id)} 
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add animation CSS */}
      <style jsx>{`
        @keyframes slideDown {
          0% {
            transform: translate(-50%, -20px);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;