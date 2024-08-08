import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChannelPage from './pages/ChannelPage';
import Header from './components/Header';
import Admin from './pages/Admin';
import PageWrapper from './components/PageWrapper';
import OverviewPage from './pages/OverviewPage'; 

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
        <Route path="/channel/:channelNumber" element={<PageWrapper><ChannelPage /></PageWrapper>} />
        <Route path="/overview" element={<PageWrapper><OverviewPage /></PageWrapper>} /> 
      </Routes>
    </Router>
  );
}

export default App;

