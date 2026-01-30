import axios from "axios";
import { useEffect, useState } from "react";

function Dataset() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchData();
  }, [currentPage, filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/dataset.php", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          filter: filter,
          search: searchTerm,
        },
      });
      setData(response.data.items || []);
      setTotalPages(response.data.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load dataset. Make sure the backend is running.");
      // Load sample data for demo purposes
      setData(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  const getSampleData = () => [
    {
      id: "1",
      text: "This is a sample non-toxic text example.",
      toxicity_label: 0,
      target_group: "none",
    },
    {
      id: "2",
      text: "Another example of neutral content.",
      toxicity_label: 0,
      target_group: "none",
    },
    {
      id: "3",
      text: "Sample toxic content placeholder.",
      toxicity_label: 1,
      target_group: "general",
    },
    {
      id: "4",
      text: "More example data for demonstration.",
      toxicity_label: 0,
      target_group: "none",
    },
    {
      id: "5",
      text: "Dataset preview mode - connect backend for real data.",
      toxicity_label: 0,
      target_group: "none",
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  };

  const getToxicityBadge = (label) => {
    if (label === 1 || label === true) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
          Toxic
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
        Non-Toxic
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📊</span>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ToxiGen Dataset
          </h1>
        </div>
        <p className="text-gray-600">
          Browse the ToxiGen dataset containing 274,186 annotated examples of toxic and
          non-toxic text across multiple target groups.
        </p>
        <div className="flex gap-3 mt-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            274K+ Samples
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            13 Target Groups
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Human Annotated
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Text
            </label>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search in dataset..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
              >
                Search
              </button>
            </form>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Label
            </label>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All</option>
              <option value="toxic">Toxic Only</option>
              <option value="non-toxic">Non-Toxic Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-5 py-4 rounded-xl mb-6 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-1 text-amber-600">Showing sample data for demonstration.</p>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center gap-3 text-gray-500">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Loading dataset...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Text
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Label
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Target Group
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                        #{item.id || index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 max-w-xl">
                        <p className="line-clamp-2">{item.text}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getToxicityBadge(item.toxicity_label)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm">
                          {item.target_group || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dataset;
