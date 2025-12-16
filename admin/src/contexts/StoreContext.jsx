import { createContext, useContext, useState } from 'react';

const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  // Define any global state and constants here
  const API = 'http://localhost:3000/api/';

  // Token stored only in memory (app state) per requirement
  const [token, setToken] = useState(null);

  const setAppToken = (t) => {
    setToken(t);
  };

  const clearAppToken = () => {
    setToken(null);
  };

  const contextValue = {
    API,
    token,
    setAppToken,
    clearAppToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStoreContext must be used within a StoreContextProvider');
  }
  return context;
};

export default StoreContextProvider;
