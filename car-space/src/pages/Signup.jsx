import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Email & Password Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  // Google Signup
  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Google Signup Successful! Redirecting to dashboard...");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('https://s3-alpha-sig.figma.com/img/fd5e/347f/c38de85842bcd8933e40cb3524f08f65?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=SlZEQ6fKuO0kWbZB2ByWm1BMnCNxiwfrfQ~XO5lAsf7hVwTPbDnOzNZUZ0TYNiXFAPLJwyy5LGy06fWEMRRlvRH6VdmDDbqOjnmEECCqVX3o1GgYYF45Iv5F-FV4Xx2J~9GxLjyY6tWLPZ-N6abgyfc2k~Onh9xpnohZz--hZVt9MGay4CLj92elC9NkyJQooP-9B8zjUkLGs4gwFJfB0oc5lMD2cT0kSmDyijaD3U70CoHv4gbWVdfI09~KvnmJcnBzwqQGiaiRLqrAbXWGA~on7yNvq8ZZsTXxUL0pLG~7yCW-jqnqG8mBEYWBp1hz~qjEFAhkjUFocUXXQTmEiA__')",
      }}
    >
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

        {/* Signup Form */}
        <div className=" md:w-1/2 p-8 h-150 w-1700">
          <h2 className="text-5xl font-bold text-center mb-4 mr-60">
            <span className="text-blue-500">Car</span>
            <span className="text-red-500">space</span>
          </h2>

          {/* Toggle between Login & Signup */}
          <div className="flex justify-center mb-4 mt-20">
            <button
              onClick={() => navigate("/login")}
              className="w-1/2 text-center py-2 border-b-2 border-gray-300"
            >
              Login
            </button>
            <button className="w-1/2 text-center py-2 border-b-2 border-red-500 text-red-500">
              Signup
            </button>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-red-500 text-white p-3 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Signup
            </button>
          </form>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold mt-3 hover:bg-blue-600 transition flex items-center justify-center"
          >
             <img src="https://static.vecteezy.com/system/resources/previews/022/484/509/non_2x/google-lens-icon-logo-symbol-free-png.png" alt="Google" className="w-5 h-5 mr-2" />
            SignUp with Google
          </button>
          

          {/* Navigate to Login */}
          <p className="text-center mt-3">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-500 underline hover:text-blue-700 transition"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;