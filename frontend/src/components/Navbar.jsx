import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home", activeColor: "blue" },
    { path: "/analyzer", label: "Analyzer", activeColor: "blue" },
    { path: "/rewriter", label: "✨ Rewriter", activeColor: "green" },
    { path: "/compare", label: "⚖️ Compare", activeColor: "purple" },
    { path: "/dataset", label: "Dataset", activeColor: "blue" },
    { path: "/insights", label: "Insights", activeColor: "blue" },
  ];

  const getActiveClass = (path, color) => {
    if (!isActive(path)) return "text-gray-600 hover:bg-gray-100";
    const colors = {
      blue: "bg-blue-100 text-blue-700",
      green: "bg-green-100 text-green-700",
      purple: "bg-purple-100 text-purple-700",
    };
    return `${colors[color]} font-medium`;
  };

  return (
    <header>
      <nav
        className="bg-white shadow-lg border-b border-gray-200"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1"
              aria-label="Text Toxicity Analyzer - Home"
            >
              <span className="text-2xl" aria-hidden="true">
                🛡️
              </span>
              <span className="font-bold text-xl text-gray-800">
                Text Toxicity Analyzer
              </span>
            </Link>

            <ul className="flex space-x-1" role="menubar">
              {navLinks.map(({ path, label, activeColor }) => (
                <li key={path} role="none">
                  <Link
                    to={path}
                    role="menuitem"
                    aria-current={isActive(path) ? "page" : undefined}
                    className={`px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${getActiveClass(path, activeColor)}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
