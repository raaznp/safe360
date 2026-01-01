import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Services from './pages/Services';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import ApplicationPage from './pages/ApplicationPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import AdminCareers from './pages/admin/AdminCareers';
import BlogPosts from './pages/admin/BlogPosts';
import Messages from './pages/admin/Messages';
import Profile from './pages/admin/Profile';
import Settings from './pages/admin/Settings';
import Media from './pages/admin/Media';
import Files from './pages/admin/Files';
import { CategoryManager, TagManager, BlogPostEditor } from './pages/admin/Blog';
import AdminPageEditor from './pages/admin/Pages/PageEditor';
import TeamManager from './pages/admin/Team/TeamManager';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import { ToastProvider } from './contexts/ToastContext';

import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <ToastProvider>
      <HelmetProvider>
        <Router>
        <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <div className="min-h-screen bg-white dark:bg-primary text-gray-900 dark:text-white font-sans flex flex-col transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
              <Outlet />
            </main>
            <Footer />
            <ScrollToTopButton />
          </div>
        }>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="products" element={<Products />} />
          <Route path="services" element={<Services />} />
          <Route path="careers" element={<Careers />} />
          <Route path="careers/apply/:id" element={<ApplicationPage />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="careers" element={<AdminCareers />} />
            <Route path="blog" element={<BlogPosts />} />
            <Route path="blog/new" element={<BlogPostEditor />} />
            <Route path="blog/edit/:id" element={<BlogPostEditor />} />
            <Route path="blog/categories" element={<CategoryManager />} />
            <Route path="blog/tags" element={<TagManager />} />
            <Route path="messages" element={<Messages />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="media" element={<Media />} />

            <Route path="files" element={<Files />} />
            <Route path="pages/:slug" element={<AdminPageEditor />} />
            <Route path="team" element={<TeamManager />} />
          </Route>
        </Route>
      </Routes>
      </Router>
      </HelmetProvider>
    </ToastProvider>
  );
}

export default App;
