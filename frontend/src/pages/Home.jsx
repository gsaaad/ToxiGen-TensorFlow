import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Text Toxicity Analyzer
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Powered by TensorFlow.js & ToxiGen Dataset
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/analyzer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Try Analyzer
          </Link>
          <Link
            to="/dataset"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            View Dataset
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 py-12">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="font-semibold text-lg mb-2">Real-time Analysis</h3>
          <p className="text-gray-600">
            Analyze any text instantly using TensorFlow.js toxicity model
            running directly in your browser.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="font-semibold text-lg mb-2">ToxiGen Dataset</h3>
          <p className="text-gray-600">
            Explore the ToxiGen dataset with annotated toxic and non-toxic
            examples across various categories.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="font-semibold text-lg mb-2">Fast & Private</h3>
          <p className="text-gray-600">
            All analysis happens locally in your browser. Your text never leaves
            your device.
          </p>
        </div>
      </div>

      {/* Toxicity Categories */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 my-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Detection Categories
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              name: "Identity Attack",
              desc: "Negative statements about identity groups",
              color: "red",
            },
            {
              name: "Insult",
              desc: "Insulting, inflammatory, or provocative language",
              color: "orange",
            },
            {
              name: "Obscene",
              desc: "Swear words, curse words, or vulgar language",
              color: "yellow",
            },
            {
              name: "Severe Toxicity",
              desc: "Very hateful, aggressive, or disrespectful content",
              color: "red",
            },
            {
              name: "Threat",
              desc: "Intention to inflict pain, injury, or violence",
              color: "red",
            },
            {
              name: "Sexual Explicit",
              desc: "References to sexual acts or body parts",
              color: "purple",
            },
          ].map((category) => (
            <div
              key={category.name}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <span
                className={`w-3 h-3 mt-1.5 rounded-full bg-${category.color}-500`}
              ></span>
              <div>
                <h4 className="font-medium text-gray-800">{category.name}</h4>
                <p className="text-sm text-gray-600">{category.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Built With</h2>
        <div className="flex justify-center flex-wrap gap-4">
          {["React 19", "TensorFlow.js", "PHP", "DynamoDB", "Tailwind CSS"].map(
            (tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-medium"
              >
                {tech}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
