import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AddImagePage from './components/AddImagePage';
import ImageDetailsPage from './components/ImageDetailsPage';
import BlogUpload from './components/BlogUpload';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blogupload" element={<BlogUpload />} />
        <Route path="/add" element={<AddImagePage />} />
        <Route path="/image/:id" element={<ImageDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;