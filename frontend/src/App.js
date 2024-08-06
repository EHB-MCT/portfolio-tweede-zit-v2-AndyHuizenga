import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChannelPage from './pages/ChannelPage';
import Header from './components/Header'; 
import Admin from './pages/Admin'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/" element={<Admin />} />
        <Route path="/channel/:channelNumber" element={<ChannelPage />} />

      </Routes>
    </Router>
  );
}

export default App;
