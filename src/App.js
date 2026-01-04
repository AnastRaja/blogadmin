import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import AddImagePage from "./components/AddImagePage";
import ImageDetailsPage from "./components/ImageDetailsPage";
import BlogUpload from "./components/BlogUpload";
import CreateCetergory from "./components/CreateCetergory";
import BlogList from "./components/BlogList";
import CotactList from "./components/CotactList";
import LoginPage from "./components/LoginPage";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/blogupload" element={<BlogUpload />} />
                <Route path="/blog/edit/:id" element={<BlogUpload />} /> {/* Edit Route */}
                <Route path="/CreateCetergory" element={<CreateCetergory />} />
                <Route path="/BlogList" element={<BlogList />} />
                <Route path="/CotactList" element={<CotactList />} />
                <Route path="/add" element={<AddImagePage />} />
                <Route path="/image/:id" element={<ImageDetailsPage />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
