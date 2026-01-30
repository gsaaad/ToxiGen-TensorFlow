import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Analyzer from "./pages/Analyzer";
import Compare from "./pages/Compare";
import Dataset from "./pages/Dataset";
import Home from "./pages/Home";
import Insights from "./pages/Insights";
import Rewriter from "./pages/Rewriter";

// Pre-load the toxicity model on app start
const preloadModel = async () => {
  if (typeof window.toxicity !== 'undefined') {
    console.log('🚀 Pre-loading toxicity model...');
    try {
      await window.toxicity.load(0.5);
      console.log('✅ Toxicity model pre-loaded successfully');
    } catch (e) {
      console.warn('Model pre-load failed, will load on demand:', e);
    }
  }
};

function App() {
  // Pre-load model when app mounts
  useEffect(() => {
    preloadModel();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/rewriter" element={<Rewriter />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/dataset" element={<Dataset />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
