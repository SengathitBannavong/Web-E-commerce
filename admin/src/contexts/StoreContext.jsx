import { createContext, useContext } from "react";

const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  // Define any global state and constants here
  const API = "http://localhost:8000/";

  const contextValue = {
    API,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStoreContext must be used within a StoreContextProvider");
  }
  return context;
};

export default StoreContextProvider;