// DataCacheContext.js
import React, { createContext, useState, useEffect } from 'react';

const DataCacheContext = createContext();

export const DataCacheProvider = ({ children }) => {
  const [cache, setCache] = useState(() => {
    const cachedData = localStorage.getItem('dataCache');
    return cachedData ? JSON.parse(cachedData) : {};
  });

  // Update localStorage whenever cache changes
  useEffect(() => {
    localStorage.setItem('dataCache', JSON.stringify(cache));
  }, [cache]);

  const getCachedData = (key) => cache[key];
  const setCachedData = (key, data) => setCache((prevCache) => ({ ...prevCache, [key]: data }));

  return (
    <DataCacheContext.Provider value={{ getCachedData, setCachedData }}>
      {children}
    </DataCacheContext.Provider>
  );
};

export default DataCacheContext;