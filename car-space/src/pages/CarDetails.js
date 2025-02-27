import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const CarDetails = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const docRef = doc(db, "cars", carId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCar({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("Car not found!");
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    };

    fetchCarDetails();
  }, [carId]);

  if (!car) {
    return <p className="text-center text-gray-500">Loading car details...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 bg-white">
      <div className="p-6 w-full max-w-xl bg-white shadow-lg rounded-lg">
        <img src={car.image} alt={car.name} className="w-full h-64 object-cover rounded-lg" />
        <h2 className="text-3xl font-bold text-red-600 mt-4">{car.name}</h2>
        <p className="text-lg text-gray-600">Price: {car.price}</p>
        <p className="text-gray-500 mt-2">{car.description}</p>
      </div>
    </div>
  );
};

export default CarDetails;