import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [localImage, setLocalImage] = useState(null); // Store uploaded image

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle image upload from the user's device
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLocalImage(imageUrl); // Store the image locally
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50">
      {/* Logo */}
      <h2 className="text-4xl font-bold text-center ml-10">
        <span className="text-red-500">Car</span>
        <span className="text-blue-500">space</span>
      </h2>

      {/* Navigation Links */}
      <div className="space-x-6">
        <button onClick={() => navigate("/")} className="text-gray-800 hover:text-blue-500">
          Home
        </button>
        <button onClick={() => navigate("/about")} className="text-black hover:text-blue-500">
          About
        </button>
        <button  onClick={() => navigate("/certified")} className="text-black mr-12 hover:text-blue-500">
          Certified Pre-Owned
        </button>
      </div>

      {/* User Profile */}
<div className="relative" onMouseEnter={() => setShowUserDetails(true)} onMouseLeave={() => setShowUserDetails(false)}>
  {user ? (
    <div className="flex items-center space-x-3">
      {/* Profile Image */}
      <div className="relative mr-4">
        <label className="cursor-pointer">
          <img
            src={localImage || user.photoURL || "https://via.placeholder.com/40"}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-gray-300 object-cover"
          />
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
      </div>

      {/* User Details Dropdown */}
      {showUserDetails && (
        <div className="absolute top-12 right-0 bg-white p-4 shadow-lg rounded-lg w-60">
          <h2 className="text-lg font-bold mb-2">User Details</h2>

          {/* Profile Image & Upload */}
          <label className="cursor-pointer flex flex-col items-center">
            <img
              src={localImage || user.photoURL || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-14 h-14 rounded-full border border-gray-300 object-cover"
            />
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            <span className="text-sm text-blue-500 mt-1">Change Photo</span>
          </label>

          {/* User Name & Email */}
          <p className="text-xl font-semibold text-center">{user.displayName || "User"}</p>
          <p className="text-gray-600 text-center">{user.email}</p>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg w-full mt-2"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    <button
      onClick={() => navigate("/login")}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
    >
      Login
    </button>
  )}
</div>
    </nav>
  );
};

export default Navbar;
