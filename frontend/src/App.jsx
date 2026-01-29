import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Analyzer from "./pages/Analyzer";
import Dataset from "./pages/Dataset";
import Home from "./pages/Home";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dataset" element={<Dataset />} />
          <Route path="/analyzer" element={<Analyzer />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
