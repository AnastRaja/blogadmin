import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import AddImagePage from "./components/AddImagePage";
import ImageDetailsPage from "./components/ImageDetailsPage";
import BlogUpload from "./components/BlogUpload";
import CreateCetergory from "./components/CreateCetergory";
import BlogList from "./components/BlogList";
import CotactList from "./components/CotactList";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blogupload" element={<BlogUpload />} />
        <Route path="/CreateCetergory" element={<CreateCetergory />} />
        <Route path="/BlogList" element={<BlogList />} />
        <Route path="/CotactList" element={<CotactList />} />

        <Route path="/add" element={<AddImagePage />} />
        <Route path="/image/:id" element={<ImageDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
