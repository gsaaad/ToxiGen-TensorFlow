import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
          <span>🚀</span>
          <span>Powered by TensorFlow.js • Privacy-First</span>
        </div>
        <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-6">
          Text Toxicity Analyzer
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Analyze text for toxicity across 7 categories with explainable AI. All
          processing happens locally — your data never leaves your browser.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/analyzer"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 flex items-center gap-2"
          >
            <span>🔬</span>
            Try Analyzer
          </Link>
          <Link
            to="/insights"
            className="bg-white hover:bg-gray-50 text-gray-800 px-8 py-3.5 rounded-xl font-semibold transition-all border-2 border-gray-200 hover:border-gray-300 flex items-center gap-2"
          >
            <span>📊</span>
            View Insights
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            🔬
          </div>
          <h3 className="font-bold text-lg mb-2 text-gray-800">
            7-Category Toxicity Analysis
          </h3>
          <p className="text-gray-600 text-sm">
            Real-time detection using TensorFlow.js with safety labels and
            visual meters.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            💡
          </div>
          <h3 className="font-bold text-lg mb-2 text-gray-800">
            Explainable AI (SHAP)
          </h3>
          <p className="text-gray-600 text-sm">
            Word importance analysis shows exactly why text is flagged as toxic.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            ✨
          </div>
          <h3 className="font-bold text-lg mb-2 text-gray-800">
            Toxic Text Rewriter
          </h3>
          <p className="text-gray-600 text-sm">
            Transform toxic language into constructive, respectful alternatives.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
          <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            😊
          </div>
          <h3 className="font-bold text-lg mb-2 text-gray-800">
            Sentiment & Emotions
          </h3>
          <p className="text-gray-600 text-sm">
            Analyze emotional tone, detect 8 emotions, and sentiment breakdown.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
          <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            📖
          </div>
          <h3 className="font-bold text-lg mb-2 text-gray-800">
            Readability Metrics
          </h3>
          <p className="text-gray-600 text-sm">
            Flesch-Kincaid, Gunning Fog, SMOG scores with grade level analysis.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
          <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            🏷️
          </div>
          <h3 className="font-bold text-lg mb-2 text-gray-800">
            Named Entity Recognition
          </h3>
          <p className="text-gray-600 text-sm">
            Detect people, places, organizations, dates, and monetary values.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
          <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            🔤
          </div>
          <h3 className="font-bold text-lg mb-2 text-gray-800">POS Tagging</h3>
          <p className="text-gray-600 text-sm">
            Part-of-speech analysis with visual distribution breakdown.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
          <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            ⚖️
          </div>
          <h3 className="font-bold text-lg mb-2 text-gray-800">
            Text Comparison
          </h3>
          <p className="text-gray-600 text-sm">
            Compare two texts side-by-side for toxicity and NLP metrics.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
          <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            🔑
          </div>
          <h3 className="font-bold text-lg mb-2 text-gray-800">
            Keyword Extraction
          </h3>
          <p className="text-gray-600 text-sm">
            Auto-extract key terms with importance scores and auto-tags.
          </p>
        </div>
      </div>

      {/* Toxicity Categories */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 my-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          7 Detection Categories
        </h2>
        <p className="text-gray-500 mb-6">
          Our model analyzes text across multiple toxicity dimensions
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: "Toxicity",
              desc: "General toxic content",
              icon: "☠️",
              color: "bg-red-500",
            },
            {
              name: "Severe Toxicity",
              desc: "Extremely harmful content",
              icon: "💀",
              color: "bg-red-700",
            },
            {
              name: "Identity Attack",
              desc: "Targeting identity groups",
              icon: "🎯",
              color: "bg-purple-500",
            },
            {
              name: "Insult",
              desc: "Insulting language",
              icon: "😤",
              color: "bg-orange-500",
            },
            {
              name: "Threat",
              desc: "Threatening content",
              icon: "⚠️",
              color: "bg-rose-500",
            },
            {
              name: "Obscene",
              desc: "Vulgar language",
              icon: "🤬",
              color: "bg-yellow-500",
            },
            {
              name: "Sexual Explicit",
              desc: "Sexual content",
              icon: "🔞",
              color: "bg-pink-500",
            },
          ].map((category) => (
            <div
              key={category.name}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div
                className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center text-white text-lg`}
              >
                {category.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{category.name}</h4>
                <p className="text-xs text-gray-500">{category.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Built With</h2>
        <p className="text-gray-500 mb-6">Modern full-stack technologies</p>
        <div className="flex justify-center flex-wrap gap-3">
          {[
            { name: "React 19", color: "bg-blue-100 text-blue-700" },
            { name: "TensorFlow.js", color: "bg-orange-100 text-orange-700" },
            { name: "PHP 8.2", color: "bg-indigo-100 text-indigo-700" },
            { name: "DynamoDB", color: "bg-yellow-100 text-yellow-700" },
            { name: "Tailwind CSS", color: "bg-cyan-100 text-cyan-700" },
          ].map((tech) => (
            <span
              key={tech.name}
              className={`px-4 py-2 ${tech.color} rounded-full font-medium`}
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
