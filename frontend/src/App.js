import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChannelPage from './pages/ChannelPage';
import Header from './components/Header';
import PageWrapper from './components/PageWrapper';
import OverviewPage from './pages/OverviewPage';
import AdminPage from './pages/adminPages/AdminPage';
import CreateAuthorPage from './pages/adminPages/CreateAuthorPage';
import AdminForm from './pages/adminPages/AdminUpload'; // AdminForm is your CreateEntryPage
import SettingsPage from './pages/adminPages/SettingsPage';
import SocialPage from './pages/SocialPage';
import Overlay from './components/Overlay';
import StepsShow from './pages/StepsShow';
import VerificationModal from './components/VerificationModal'; // Import VerificationModal
import './css/index.css'; // Importing global styles

function App() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayContent, setOverlayContent] = useState('');
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const [enterPressCount, setEnterPressCount] = useState(0); // Track the number of Enter key presses
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [pendingAuthor, setPendingAuthor] = useState(null); // State to hold the author to verify
  const [backgroundImage, setBackgroundImage] = useState(
    'https://images.ctfassets.net/2x4vothfh006/6JMV9HK1W3fUrdySCC6AS8/031ddedabd3e7e7b090dc1827a1ec85d/selected_18.jpg'
  ); // State to hold background image

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
    setPendingAuthor(author); // Set the author to be verified
    setIsVerificationModalOpen(true); // Open the modal
  };

  const handleCloseVerificationModal = () => {
    setIsVerificationModalOpen(false);
    setPendingAuthor(null); // Reset the pending author after modal closes
  };

  const handleVerify = () => {
    console.log("Verification successful!");
    handleCloseVerificationModal(); // Close the modal after verification
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        setEnterPressCount((prevCount) => prevCount + 1);

        // If the user presses Enter twice within 500ms, toggle dark mode
        if (enterPressCount === 1) {
          toggleDarkMode();
        }

        // Reset the count after 500ms if no other Enter key is pressed
        setTimeout(() => {
          setEnterPressCount(0);
        }, 500);
      }
    };

    if (!isVerificationModalOpen) {
      // Only add event listener if modal is not open
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      // Always remove the event listener when the component unmounts or modal opens
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
                    setBackgroundImage={setBackgroundImage} // Pass function to update background image
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
                    setBackgroundImage={setBackgroundImage} // Pass function to update background image
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
                    setBackgroundImage={setBackgroundImage} // Pass function to update background image
                  />
                </PageWrapper>
              } 
            />
          </Routes>
          <Overlay visible={overlayVisible} content={overlayContent} onClose={hideOverlay} />
          <VerificationModal 
            show={overlayVisible}
            handleClose={hideOverlay}
          />
        </Router>
      </div>
    </div>
  );
}

export default App;