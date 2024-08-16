import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChannelPage from './pages/ChannelPage';
import Header from './components/Header';
import PageWrapper from './components/PageWrapper';
import OverviewPage from './pages/OverviewPage';
import AdminPage from './pages/adminPages/AdminPage';
import CreateAuthorPage from './pages/adminPages/CreateAuthorPage';
import AdminForm from './pages/adminPages/AdminUpload';
import SettingsPage from './pages/adminPages/SettingsPage';
import SocialPage from './pages/SocialPage';
import Overlay from './components/Overlay';
import StepsShow from './pages/StepsShow';
import VerificationModal from './components/VerificationModal'; // Import VerificationModal
import './css/index.css';

function App() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayContent, setOverlayContent] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [enterPressCount, setEnterPressCount] = useState(0);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [pendingAuthor, setPendingAuthor] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(
    'https://images.ctfassets.net/2x4vothfh006/6JMV9HK1W3fUrdySCC6AS8/031ddedabd3e7e7b090dc1827a1ec85d/selected_18.jpg'
  );
  const [bgOpacity, setBgOpacity] = useState(1);

  const showOverlay = (content) => {
    setOverlayContent(content);
    setOverlayVisible(true);
  };

  const hideOverlay = () => {
    setOverlayVisible(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleOpenVerificationModal = (author) => {
    setPendingAuthor(author);
    setIsVerificationModalOpen(true);
  };

  const handleCloseVerificationModal = () => {
    setIsVerificationModalOpen(false);
    setPendingAuthor(null);
  };

  const handleVerify = () => {
    console.log("Verification successful!");
    handleCloseVerificationModal();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isVerificationModalOpen) {
        return; // Skip global key handling if the modal is open
      }

      if (event.key === 'Enter') {
        setEnterPressCount((prevCount) => prevCount + 1);

        if (enterPressCount === 1) {
          toggleDarkMode();
        }

        setTimeout(() => {
          setEnterPressCount(0);
        }, 500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enterPressCount, isVerificationModalOpen]);

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      {darkMode && (
        <>
          <div
            className="background-image"
            style={{
              backgroundImage: `url(${backgroundImage})`,
            }}
          ></div>
          <div className="background-filter"></div>
        </>
      )}
      <div className="app-content">
        <Router>
          <Header
            showOverlay={showOverlay}
            hideOverlay={hideOverlay}
            darkMode={darkMode}
            isVerificationModalOpen={isVerificationModalOpen} // Pass this prop to Header
          />
          <Routes>
            <Route path="/" element={<PageWrapper><HomePage darkMode={darkMode} /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><AdminPage darkMode={darkMode} /></PageWrapper>} />
            <Route 
              path="/admin/create-author" 
              element={<PageWrapper><CreateAuthorPage darkMode={darkMode} /></PageWrapper>} 
            />
            <Route 
              path="/admin/create-entry" 
              element={
                <PageWrapper>
                  <AdminForm 
                    darkMode={darkMode}
                    handleOpenVerificationModal={handleOpenVerificationModal} 
                  />
                </PageWrapper>
              }
            />
            <Route 
              path="/admin/settings" 
              element={<PageWrapper><SettingsPage darkMode={darkMode} /></PageWrapper>} 
            />
            <Route 
              path="/channel/:channelNumber" 
              element={
                <PageWrapper>
                  <ChannelPage
                    darkMode={darkMode}
                    setBackgroundImage={setBackgroundImage}
                  />
                </PageWrapper>
              }
            />
            <Route path="/overview" element={<PageWrapper><OverviewPage darkMode={darkMode} /></PageWrapper>} />
            <Route 
              path="/social" 
              element={
                <PageWrapper>
                  <SocialPage
                    darkMode={darkMode}
                    setBackgroundImage={setBackgroundImage}
                  />
                </PageWrapper>
              }
            />
            <Route 
              path="/steps" 
              element={
                <PageWrapper>
                  <StepsShow 
                    darkMode={darkMode} 
                    setBackgroundImage={setBackgroundImage} 
                  />
                </PageWrapper>
              } 
            />
          </Routes>
          <Overlay visible={overlayVisible} content={overlayContent} onClose={hideOverlay} />
          <VerificationModal 
            show={isVerificationModalOpen}
            handleClose={handleCloseVerificationModal}
            onVerify={handleVerify}
            author={pendingAuthor}
          />
        </Router>
      </div>
    </div>
  );
}

export default App;