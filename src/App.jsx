import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoFirstPage from "./VideoFirstPage";
import AdminPage from "./AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VideoFirstPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
