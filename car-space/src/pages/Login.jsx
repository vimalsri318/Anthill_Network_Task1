import { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const adminEmail = "admin@example.com"; // Replace with actual admin email

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

  // Google Sign-In
  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const userEmail = userCredential.user.email;

      if (userEmail === adminEmail) {
        showAlert("Admin Login Successful!");
        setTimeout(() => navigate("/admin-dashboard"), 1500);
      } else {
        showAlert("User Login Successful!");
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error) {
      showAlert(error.message, "error");
    }
  };

  // Email & Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email;

      if (userEmail === adminEmail) {
        showAlert("Admin Login Successful!");
        setTimeout(() => navigate("/admin-dashboard"), 1500);
      } else {
        showAlert("User Login Successful!");
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error) {
      showAlert(error.message, "error");
    }
  };

  // Custom Alert Component
  const Alert = ({ message, type }) => {
    const getAlertStyle = () => {
      switch (type) {
        case "error":
          return {
            container: "bg-red-50 border-red-500 text-red-800",
            icon: "❌"
          };
        case "success":
          return {
            container: "bg-green-50 border-green-500 text-green-800",
            icon: "✅"
          };
        default:
          return {
            container: "bg-blue-50 border-blue-500 text-blue-800",
            icon: "ℹ️"
          };
      }
    };

    const style = getAlertStyle();
    
    return (
      <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 
                     ${style.container} border-l-4 rounded-md px-4 py-3 shadow-md 
                     animate-fade-in-down flex items-center space-x-2 min-w-80 max-w-md`}>
        <span className="text-xl flex-shrink-0">{style.icon}</span>
        <p className="font-medium">{message}</p>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('https://s3-alpha-sig.figma.com/img/fd5e/347f/c38de85842bcd8933e40cb3524f08f65?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=SlZEQ6fKuO0kWbZB2ByWm1BMnCNxiwfrfQ~XO5lAsf7hVwTPbDnOzNZUZ0TYNiXFAPLJwyy5LGy06fWEMRRlvRH6VdmDDbqOjnmEECCqVX3o1GgYYF45Iv5F-FV4Xx2J~9GxLjyY6tWLPZ-N6abgyfc2k~Onh9xpnohZz--hZVt9MGay4CLj92elC9NkyJQooP-9B8zjUkLGs4gwFJfB0oc5lMD2cT0kSmDyijaD3U70CoHv4gbWVdfI09~KvnmJcnBzwqQGiaiRLqrAbXWGA~on7yNvq8ZZsTXxUL0pLG~7yCW-jqnqG8mBEYWBp1hz~qjEFAhkjUFocUXXQTmEiA__')" }}
    >
      {/* Alert Component */}
      {alert.show && <Alert message={alert.message} type={alert.type} />}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Container */}
      <div className="relative flex bg-white shadow-lg rounded-lg w-full max-w-4xl">
        {/* Car Image Section */}
        <div className="w-1/2 hidden md:flex items-center justify-center bg-gray-200 rounded-l-lg overflow-hidden">
          <img 
            src="https://s3-alpha-sig.figma.com/img/8e7c/c115/ed58efe651720e0a9cb2c840be13e535?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=pvyK5BAHXf813e~q8QckltwwzCCiAdlRu-V1yfVPSz7pRcL~6pkyKwmo8ZV~cMI~te8kZXWnMWQRUra0OzqAWw2q3krKTsvPpXlJpKStm01WaHVod97neD4ktc~DmxBzxXrFB8Ao59tJsqMKLkKn3Fy22NQz9w2izdhh5IMEKDb-rGGRkTsbJh6xyXjIytFK0dhXqn8vnAmJvhALrFZH34x3ONqm76DjhBZfgBuoWh8y668yX2FfCraklf6YdJTxSEPRdznT8xmenZ0CVFP~JFAYsHxB-ps7kdpj9ATHuxYxPmwmPGNi~YVHK48H7EXq4s5Dzwr2MCCrBcYmjfXaPA__" 
            alt="Car" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Login Form Section */}
        <div className="md:w-1/2 p-8 h-150 w-1700">
          <h2 className="text-5xl font-bold text-center mb-4 mr-60">
            <span className="text-blue-500">Car</span>
            <span className="text-red-500">space</span>
          </h2>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-4 mt-20">
            <button className="w-1/2 text-center py-2 border-b-2 border-red-500 text-red-500">
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="w-1/2 text-center py-2 border-b-2 border-gray-300"
            >
              Signup
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-red-500 text-white p-3 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Login
            </button>
          </form>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold mt-3 hover:bg-blue-600 transition flex items-center justify-center"
          >
            <img src="https://static.vecteezy.com/system/resources/previews/022/484/509/non_2x/google-lens-icon-logo-symbol-free-png.png" alt="Google" className="w-5 h-5 mr-2" />
            Login with Google
          </button>

          {/* Navigate to Signup */}
          <p className="text-center mt-3">
            Don't have an account? {" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-500 underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;