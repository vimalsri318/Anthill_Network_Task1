import React, { createContext, useContext, useState } from "react";

const CarRequestContext = createContext();

export const useCarRequest = () => {
  return useContext(CarRequestContext);
};

export const CarRequestProvider = ({ children }) => {
  const [carRequests, setCarRequests] = useState([]);

  const addCarRequest = (car, user) => {
    setCarRequests((prevRequests) => [
      ...prevRequests,
      { car, user, status: "Pending" },
    ]);
  };

  return (
    <CarRequestContext.Provider value={{ carRequests, addCarRequest }}>
      {children}
    </CarRequestContext.Provider>
  );
};