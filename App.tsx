import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import ChatAssistant from './components/ChatAssistant';

// Critical routes - loaded immediately (homepage and marketplace)
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';

// Lazy loaded routes - loaded on demand for better performance
const Checkout = lazy(() => import('./pages/Checkout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const About = lazy(() => import('./pages/About'));
const Partners = lazy(() => import('./pages/Partners'));
const PartnerLogin = lazy(() => import('./pages/PartnerLogin'));
const Login = lazy(() => import('./pages/Login'));
const Legal = lazy(() => import('./pages/Legal'));
const Support = lazy(() => import('./pages/Support'));
const Profile = lazy(() => import('./pages/Profile'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const CountryPage = lazy(() => import('./pages/CountryPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-pars-bg dark:bg-stone-950 flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <HashRouter>
          <Routes>
            {/* Routes without Layout (Standalone) */}
            <Route 
              path="/partner-login" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <PartnerLogin />
                </Suspense>
              } 
            />
            <Route 
              path="/login" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <Login />
                </Suspense>
              } 
            />
            
            {/* Main Layout Routes */}
            <Route path="*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route 
                    path="/checkout" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Checkout />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Dashboard />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Admin />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/about" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <About />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/partners" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Partners />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/legal" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Legal />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/support" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Support />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/help" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <HelpCenter />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/blog" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Blog />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/blog/:slug" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <BlogPost />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/esim/:countrySlug" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <CountryPage />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Profile />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="*" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <NotFound />
                      </Suspense>
                    } 
                  />
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