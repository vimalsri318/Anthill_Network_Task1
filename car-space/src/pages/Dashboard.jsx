
import { auth, db } from "../firebase";
import Navbar from "./Navbar";
import CarBookingSection from "./CarBookingSection";
import Availcars from "./Availcars";
import Sec from "./Sec";

console.log("Profile Image URL:", auth.currentUser?.photoURL);

const Dashboard = () => {
 
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>
      <CarBookingSection/>
      <Availcars/>
     <Sec/>
    </div>
  
  );
};

export default Dashboard;
