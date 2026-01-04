import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import About from './pages/About';
import Partners from './pages/Partners';
import PartnerLogin from './pages/PartnerLogin';
import Login from './pages/Login';
import Legal from './pages/Legal';
import Support from './pages/Support';
import Profile from './pages/Profile';
import HelpCenter from './pages/HelpCenter';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import CountryPage from './pages/CountryPage';
import NotFound from './pages/NotFound';
import ChatAssistant from './components/ChatAssistant';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <HashRouter>
          <Routes>
            {/* Routes without Layout (Standalone) */}
            <Route path="/partner-login" element={<PartnerLogin />} />
            <Route path="/login" element={<Login />} />
            
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
                  <Route path="/help" element={<HelpCenter />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/esim/:countrySlug" element={<CountryPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            } />
          </Routes>
          <ChatAssistant />
        </HashRouter>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;