import { createContext, useContext, useState } from "react";

const CarContext = createContext();

export const useCarContext = () => useContext(CarContext);

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);

  const addCar = (newCar) => {
    setCars([...cars, { ...newCar, id: Date.now() }]); // Add with unique ID
  };

  const updateCar = (id, updatedCar) => {
    setCars(cars.map((car) => (car.id === id ? updatedCar : car)));
  };

  const deleteCar = (id) => {
    setCars(cars.filter((car) => car.id !== id));
  };

  return (
    <CarContext.Provider value={{ cars, addCar, updateCar, deleteCar }}>
      {children}
    </CarContext.Provider>
  );
};