import axios from "axios";
import { useEffect, useState } from "react";
import { CategoryBar, PieChart, StatCard } from "../components/DatasetStats";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  LoadingSpinner,
} from "../components/UI";

function Insights() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/stats.php");
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching stats:", err);
      // Use demo data on error
      setStats(getDemoStats());
      setError("Using demo data - Connect backend for live statistics");
    } finally {
      setLoading(false);
    }
  };

  const getDemoStats = () => ({
    total_count: 274186,
    toxic_count: 132157,
    non_toxic_count: 142029,
    toxic_percentage: 48.2,
    non_toxic_percentage: 51.8,
    categories: {
      toxicity: { count: 98234, percentage: 35.8 },
      insult: { count: 67543, percentage: 24.6 },
      identity_attack: { count: 45678, percentage: 16.7 },
      obscene: { count: 34567, percentage: 12.6 },
      threat: { count: 23456, percentage: 8.6 },
      sexual_explicit: { count: 4892, percentage: 1.8 },
    },
    target_groups: {
      general: { count: 96500, percentage: 35.2 },
      identity: { count: 77870, percentage: 28.4 },
      political: { count: 51273, percentage: 18.7 },
      other: { count: 48543, percentage: 17.7 },
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading dataset insights..." />
      </div>
    );
  }

  const categoryColors = {
    toxicity: "bg-red-500",
    insult: "bg-orange-500",
    identity_attack: "bg-purple-500",
    obscene: "bg-yellow-500",
    threat: "bg-rose-500",
    sexual_explicit: "bg-pink-500",
  };

  const targetGroupColors = {
    general: "bg-blue-500",
    identity: "bg-indigo-500",
    political: "bg-cyan-500",
    other: "bg-gray-500",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          📈 Dataset Insights
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore statistics and visualizations of the ToxiGen dataset —
          understanding the data behind toxicity detection.
        </p>
      </div>

      {error && <Alert type="warning" title="Demo Mode" message={error} />}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Samples"
          value={stats.total_count.toLocaleString()}
          subtitle="ToxiGen Dataset"
          icon="📊"
          color="blue"
        />
        <StatCard
          title="Toxic Samples"
          value={stats.toxic_count.toLocaleString()}
          subtitle={`${stats.toxic_percentage}% of dataset`}
          icon="⚠️"
          color="red"
        />
        <StatCard
          title="Non-Toxic Samples"
          value={stats.non_toxic_count.toLocaleString()}
          subtitle={`${stats.non_toxic_percentage}% of dataset`}
          icon="✅"
          color="green"
        />
        <StatCard
          title="Categories"
          value="7"
          subtitle="Toxicity types detected"
          icon="🏷️"
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <span>🥧</span>
              Toxic vs Non-Toxic Distribution
            </h2>
          </CardHeader>
          <CardBody>
            <PieChart
              toxic={stats.toxic_percentage}
              nonToxic={stats.non_toxic_percentage}
            />
            <div className="flex justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">
                  Toxic ({stats.toxic_percentage}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">
                  Non-Toxic ({stats.non_toxic_percentage}%)
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <span>📊</span>
              Category Distribution
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {Object.entries(stats.categories).map(([key, value]) => (
              <CategoryBar
                key={key}
                name={key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                count={value.count}
                percentage={value.percentage}
                color={categoryColors[key] || "bg-gray-500"}
              />
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Target Groups */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span>🎯</span>
            Target Group Analysis
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Distribution of toxic content across different target groups
          </p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(stats.target_groups).map(([key, value]) => (
              <div key={key} className="text-center p-4 bg-gray-50 rounded-xl">
                <div
                  className={`w-16 h-16 mx-auto rounded-full ${targetGroupColors[key]} flex items-center justify-center text-white text-2xl font-bold mb-3`}
                >
                  {value.percentage}%
                </div>
                <h3 className="font-semibold text-gray-800 capitalize">
                  {key}
                </h3>
                <p className="text-sm text-gray-500">
                  {value.count.toLocaleString()} samples
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span>💡</span>
            Key Insights
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Balanced Dataset
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  The dataset is nearly balanced with 48.2% toxic and 51.8%
                  non-toxic samples, reducing class imbalance issues in model
                  training.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Diverse Categories
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  General toxicity (35.8%) and insults (24.6%) are most common,
                  while sexual explicit content is rare (1.8%).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Identity-Related Content
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  28.4% of toxic content targets identity groups, highlighting
                  the importance of detecting identity-based attacks.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Machine-Generated
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  ToxiGen uses machine-generated text, providing diverse
                  linguistic patterns that may differ from human-written toxic
                  content.
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Data Source */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p>
          Data source:{" "}
          <a
            href="https://huggingface.co/datasets/toxigen/toxigen-data"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            ToxiGen Dataset
          </a>{" "}
          (Hartvigsen et al., 2022)
        </p>
      </div>
    </div>
  );
}

export default Insights;
