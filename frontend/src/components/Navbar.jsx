import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🛡️</span>
            <span className="font-bold text-xl text-gray-800">
              Text Toxicity Analyzer
            </span>
          </Link>

          <div className="flex space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Home
            </Link>
            <Link
              to="/analyzer"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive("/analyzer")
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Analyzer
            </Link>
            <Link
              to="/rewriter"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive("/rewriter")
                  ? "bg-green-100 text-green-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              ✨ Rewriter
            </Link>
            <Link
              to="/compare"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive("/compare")
                  ? "bg-purple-100 text-purple-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              ⚖️ Compare
            </Link>
            <Link
              to="/dataset"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive("/dataset")
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Dataset
            </Link>
            <Link
              to="/insights"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive("/insights")
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Insights
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
