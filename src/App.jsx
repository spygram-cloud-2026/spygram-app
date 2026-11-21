import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import MatrixBackground from './components/MatrixBackground';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import LandingPage from './pages/LandingPage';
import InstagramClonePage from './pages/InstagramClonePage';
import InvasionConcludedPage from './pages/InvasionConcludedPage';
import CheckoutPage from './pages/CheckoutPage';
import DirectInboxPage from './pages/DirectInboxPage';
import ChatDetailPage from './pages/ChatDetailPage';
import ServersPage from './pages/ServersPage';
import CreditsPage from './pages/CreditsPage';
import AdminPage from './pages/AdminPage';

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
}

function MatrixLayout({ children }) {
  return (
    <>
      <MatrixBackground />
      {children}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-[#e1306c] selection:text-white relative">
          <Routes>
            <Route
              path="/"
              element={
                <MatrixLayout>
                  <LandingPage />
                </MatrixLayout>
              }
            />
            <Route path="/instagram" element={<InstagramClonePage />} />
            <Route
              path="/invasion-concluded"
              element={
                <MatrixLayout>
                  <InvasionConcludedPage />
                </MatrixLayout>
              }
            />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/messages" element={<DirectInboxPage />} />
            <Route path="/chat/:id" element={<ChatDetailPage />} />
            <Route
              path="/servers"
              element={
                <MatrixLayout>
                  <ServersPage />
                </MatrixLayout>
              }
            />
            <Route
              path="/credits"
              element={
                <MatrixLayout>
                  <CreditsPage />
                </MatrixLayout>
              }
            />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Floating WhatsApp support button */}
          <FloatingWhatsApp />

          {/* Toaster notifications */}
          <Toaster
            position="bottom-left"
            toastOptions={{
              duration: 4000,
              style: { background: '#222', color: '#fff', border: '1px solid #444' },
              success: { style: { background: '#16a34a', color: '#fff' } },
              error: { style: { background: '#dc2626', color: '#fff' } }
            }}
          />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
