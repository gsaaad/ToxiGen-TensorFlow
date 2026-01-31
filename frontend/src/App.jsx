import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import { ToastProvider } from "./components/Toast";
import Analyzer from "./pages/Analyzer";
import Compare from "./pages/Compare";
import Dataset from "./pages/Dataset";
import Home from "./pages/Home";
import Insights from "./pages/Insights";
import Rewriter from "./pages/Rewriter";

// Pre-load the toxicity model on app start
const preloadModel = async () => {
  if (typeof window.toxicity !== "undefined") {
    console.log("🚀 Pre-loading toxicity model...");
    try {
      await window.toxicity.load(0.5);
      console.log("✅ Toxicity model pre-loaded successfully");
    } catch (e) {
      console.warn("Model pre-load failed, will load on demand:", e);
    }
  }
};

function App() {
  // Pre-load model when app mounts
  useEffect(() => {
    preloadModel();
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg"
          >
            Skip to main content
          </a>
          <Navbar />
          <main
            id="main-content"
            className="container mx-auto px-4 py-8"
            role="main"
          >
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
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
