import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import HomePage from './pages/HomePage';
import ChannelPage from './pages/ChannelPage';
import Header from './components/Header';
import PageWrapper from './components/PageWrapper';
import OverviewPage from './pages/OverviewPage';
import AdminPage from './pages/adminPages/AdminPage';
import CreateAuthorPage from './pages/adminPages/CreateAuthorPage';
import AdminForm from './pages/adminPages/AdminUpload';
import InfoPage from './pages/adminPages/InfoPages';
import SocialPage from './pages/SocialPage';
import Overlay from './components/Overlay';
import StepsShow from './pages/StepsShow';
import VerificationModal from './components/VerificationModal';
import './css/index.css';
import './css/transitions.css';
import AdminOverlay from './components/AdminOverlay'; 

function App() {
  const location = useLocation();
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayContent, setOverlayContent] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [pendingAuthor, setPendingAuthor] = useState(null);
  const [disableNumberNavigation, setDisableNumberNavigation] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(
    'https://images.ctfassets.net/2x4vothfh006/6JMV9HK1W3fUrdySCC6AS8/031ddedabd3e7e7b090dc1827a1ec85d/selected_18.jpg'
  );

  const [enterPressCount, setEnterPressCount] = useState(0);
  const enterTimeoutRef = useRef(null); // UseRef to store the timeout ID

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle('dark-mode', !darkMode);
    console.log('Dark Mode:', !darkMode);

  };

  const isAdminPage = location.pathname.startsWith('/admin');

  

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        setEnterPressCount((prevCount) => prevCount + 1);
      }
    };

    const resetPressCount = () => {
      if (enterPressCount === 2) {
        toggleDarkMode(); // Toggle dark mode if 'Enter' is pressed twice within 500ms
      }
      setEnterPressCount(0);
    };

    window.addEventListener('keydown', handleKeyDown);

    if (enterPressCount > 0) {
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current); // Clear the existing timeout
      enterTimeoutRef.current = setTimeout(resetPressCount, 500); // Set a new timeout for resetting the press count
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current); // Clean up timeout on unmount
    };
  }, [enterPressCount]);

  const handleOpenVerificationModal = (author) => {
    setPendingAuthor(author);
    setIsVerificationModalOpen(true);
  };

  const handleCloseVerificationModal = () => {
    setIsVerificationModalOpen(false);
    setPendingAuthor(null);
  };

  const handleVerify = () => {
    console.log('Verification successful!');
    handleCloseVerificationModal();
  };

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

<Header
  darkMode={darkMode}
  isVerificationModalOpen={isVerificationModalOpen}
  isAdminPage={isAdminPage} 
/>

      <div className="app-content">
        <TransitionGroup>
          <CSSTransition
            key={location.key}
            timeout={2500} // Match the transition duration + delay for smoother effect
            classNames="fade"
          >
            {/* Apply transition to the wrapper */}
            <div className="page-wrapper">
              <Routes location={location}>
                <Route path="/" element={<PageWrapper><HomePage darkMode={darkMode} /></PageWrapper>} />
                <Route path="/admin" element={<PageWrapper><AdminPage darkMode={darkMode}    setBackgroundImage={setBackgroundImage} /></PageWrapper>} />
                <Route path="/admin/create-author" element={<PageWrapper><CreateAuthorPage darkMode={darkMode} setDisableNumberNavigation={setDisableNumberNavigation} /></PageWrapper>} />
                <Route
                  path="/admin/create-entry"
                  element={
                    <PageWrapper>
                      <AdminForm
                        darkMode={darkMode}
                        handleOpenVerificationModal={handleOpenVerificationModal}

                        setBackgroundImage={setBackgroundImage}
                      />
                    </PageWrapper>
                  }
                />
  <Route path="/admin/info" element={<PageWrapper><InfoPage /></PageWrapper>} />
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
                <Route path="/overview" element={<PageWrapper><OverviewPage darkMode={darkMode} setBackgroundImage={setBackgroundImage} /></PageWrapper>} />
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
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>

      <Overlay visible={overlayVisible} content={overlayContent} onClose={() => setOverlayVisible(false)} />
      <VerificationModal
        show={isVerificationModalOpen}
        handleClose={handleCloseVerificationModal}
        onVerify={handleVerify}
        author={pendingAuthor}
      />
      <AdminOverlay 
  visible={overlayVisible} 
  onClose={() => setOverlayVisible(false)} 
/>
    </div>
  );
}

export default App;