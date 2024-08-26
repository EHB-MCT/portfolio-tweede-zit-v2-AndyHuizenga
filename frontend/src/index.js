import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; 
import './css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DataCacheProvider } from './utils/DataCacheContext'; // Import the provider

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <DataCacheProvider> {/* Wrap your app with DataCacheProvider */}
      <Router>
        <App />
      </Router>
    </DataCacheProvider>
  </React.StrictMode>
);

reportWebVitals();