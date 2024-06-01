import React, { createContext, useState, useContext } from 'react';


export const DataProvider = ({ children }) => {
    const [settings, setSettings] = useState(null);
    
    return (
        <DataContext.Provider value={{ settings, setSettings }}>
      {children}
    </DataContext.Provider>
  );
};

const DataContext = createContext(DataProvider);

export const useDataContext = () => useContext(DataContext);

export default DataContext;
