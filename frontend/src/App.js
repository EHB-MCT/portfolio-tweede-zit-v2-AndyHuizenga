import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChannelPage from './pages/ChannelPage';
import Header from './components/Header';
import Admin from './pages/Admin';
import PageWrapper from './components/PageWrapper';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
        <Route path="/channel/:channelNumber" element={<PageWrapper><ChannelPage /></PageWrapper>} />
      </Routes>
    </Router>
  );
}

export default App;
