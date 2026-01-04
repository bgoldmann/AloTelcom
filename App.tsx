import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store';
import Layout from './components/Layout';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import About from './pages/About';
import Partners from './pages/Partners';
import PartnerLogin from './pages/PartnerLogin';
import Legal from './pages/Legal';
import Support from './pages/Support';
import Profile from './pages/Profile';
import ChatAssistant from './components/ChatAssistant';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Routes without Layout (Standalone) */}
          <Route path="/partner-login" element={<PartnerLogin />} />
          
          {/* Main Layout Routes */}
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/about" element={<About />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/support" element={<Support />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          } />
        </Routes>
        <ChatAssistant />
      </HashRouter>
    </AppProvider>
  );
};

export default App;