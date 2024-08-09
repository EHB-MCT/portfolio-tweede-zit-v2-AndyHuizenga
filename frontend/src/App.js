import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChannelPage from './pages/ChannelPage';
import Header from './components/Header';
import Admin from './pages/adminPages/AdminUpload';
import PageWrapper from './components/PageWrapper';
import OverviewPage from './pages/OverviewPage'; 
import AdminPage from './pages/adminPages/AdminPage';
import CreateAuthorPage from './pages/adminPages/CreateAuthorPage';
import CreateEntryPage from './pages/adminPages/CreateEntryPage';
import SettingsPage from './pages/adminPages/SettingsPage';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><AdminPage /></PageWrapper>} />
        <Route path="/admin/create-author" element={<PageWrapper><CreateAuthorPage /></PageWrapper>} />
        <Route path="/admin/create-entry" element={<PageWrapper><CreateEntryPage /></PageWrapper>} />
        <Route path="/admin/settings" element={<PageWrapper><SettingsPage /></PageWrapper>} />
        <Route path="/channel/:channelNumber" element={<PageWrapper><ChannelPage /></PageWrapper>} />
        <Route path="/overview" element={<PageWrapper><OverviewPage /></PageWrapper>} /> 
      </Routes>
    </Router>
  );
}

export default App;

