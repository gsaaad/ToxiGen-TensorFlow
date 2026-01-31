# Text Toxicity Analyzer

## Portfolio Demo Application — NLP & ML Skills Showcase

A streamlined full-stack application demonstrating NLP expertise through text toxicity detection with explainable AI and data analysis capabilities.

---

## 🎯 Project Goals

- **Demonstrate NLP/ML Integration** — Using pre-trained TensorFlow.js toxicity model
- **Showcase Explainability (SHAP)** — Understand why text is classified as toxic
- **Data Analysis Skills** — Explore and visualize the ToxiGen dataset
- **Clean Full-Stack Architecture** — React 19 + PHP + DynamoDB

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│             Frontend (React 19 + Vite + TailwindCSS)        │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │   Real-time    │  │  SHAP Word     │  │   Dataset    │  │
│  │   Analyzer     │  │  Importance    │  │   Explorer   │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                  Backend API (PHP 8.2)                      │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │    Dataset     │  │     Stats      │  │    Health    │  │
│  │   Endpoints    │  │   Endpoints    │  │    Check     │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                     Data Layer                              │
│  ┌─────────────────────────┐  ┌──────────────────────────┐ │
│  │   DynamoDB (Dataset)    │  │  TensorFlow.js (Model)   │ │
│  └─────────────────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Key Point**: The TensorFlow.js model runs **client-side** for privacy. No text data leaves the browser.

---

## ✨ Features

### 1. Real-Time Toxicity Analysis

Uses the pre-trained TensorFlow.js toxicity model (no training required).

**7 Detection Categories:**
| Category | Description |
|----------|-------------|
| Toxicity | General toxic content |
| Severe Toxicity | Extremely harmful content |
| Identity Attack | Targeting identity groups |
| Insult | Insulting language |
| Threat | Threatening language |
| Obscene | Vulgar/profane content |
| Sexual Explicit | Sexual content |

**Safety Labels:**
| Score Range | Label | Indicator |
|-------------|-------|----------|
| 0-10% | Safe | 🟢 |
| 10-30% | Low Risk | 🔵 |
| 30-50% | Moderate | 🟡 |
| 50-70% | High Risk | 🟠 |
| 70%+ | Toxic | 🔴 |

**Implementation:**

```javascript
// Using pre-trained TensorFlow.js model
import * as toxicity from "@tensorflow-models/toxicity";

const THRESHOLD = 0.9;
const model = await toxicity.load(THRESHOLD);
const predictions = await model.classify([text]);
```

---

### 2. SHAP-Style Word Importance (Explainability)

Visualize which words contribute most to toxicity scores using perturbation-based importance scoring.

**How It Works:**

- Analyze token-level contributions to predictions
- Highlight toxic vs. safe word influences
- Show top contributing words per category

**Visualization Example:**

```
"You are a complete idiot and waste of space"
        ↓
┌────────────────────────────────────────────────┐
│  You      → +0.02 (neutral)                    │
│  are      → +0.01 (neutral)                    │
│  complete → +0.08 (amplifier)                  │
│  idiot    → +0.89 (HIGH - insult)       🔴     │
│  waste    → +0.34 (negative)            🟡     │
│  of       → +0.01 (neutral)                    │
│  space    → +0.12 (context-dependent)          │
└────────────────────────────────────────────────┘
```

**Key Insight**: Users see WHY text is flagged, not just that it's toxic.

---

### 3. Dataset Analysis & Exploration

Interactive exploration of the ToxiGen dataset with statistics and visualizations.

**Dataset Statistics Dashboard:**

- Total samples count
- Toxic vs Non-toxic distribution
- Category breakdown charts
- Target group analysis

**Search & Filter:**

- Full-text search
- Filter by toxicity label
- Filter by target group
- Pagination support

---

### 4. Comprehensive NLP Analysis Suite

A tabbed interface providing 10 different NLP analysis tools:

| Tab            | Feature                                            | Library             |
| -------------- | -------------------------------------------------- | ------------------- |
| 📊 Statistics  | Word count, sentences, paragraphs, avg word length | Built-in            |
| 💭 Sentiment   | Positive/negative/neutral scoring                  | `sentiment`         |
| 📖 Readability | Flesch-Kincaid, grade level, reading time          | Built-in            |
| 🔑 Keywords    | Top keywords with frequency counts                 | `keyword-extractor` |
| 🌍 Language    | Auto-detect language from text                     | `franc-min`         |
| 🏷️ POS Tags    | Parts of speech tagging (nouns, verbs, etc.)       | `compromise`        |
| 👤 Entities    | Named entity recognition (people, places, orgs)    | `compromise`        |
| 😊 Emotions    | Joy, sadness, anger, fear, surprise detection      | Pattern matching    |
| ✍️ Style       | Formality, vocabulary diversity, sentence variety  | Built-in            |
| ☁️ Word Cloud  | Visual word frequency display                      | Built-in            |

---

### 5. Toxic Text Rewriter

Transform toxic content into constructive alternatives:

**Features:**

- Convert toxic text to neutral/professional language
- Generate "safe insults" (humorous, non-offensive alternatives)
- Severity indicator for input text
- Writing tips cheatsheet
- Multiple rewrite suggestions

**Example Transformations:**

```
"You're an idiot" → "I respectfully disagree with your perspective"
"This is stupid"  → "I have concerns about this approach"
"Shut up"         → "I'd appreciate a moment to share my thoughts"
```

---

### 6. Text Comparison Tool

Compare two texts for similarity analysis:

- **Similarity Score**: Percentage match using string-similarity
- **Side-by-side Analysis**: View both texts with individual stats
- **Detailed Metrics**: Word count, character count, unique words
- **Use Cases**: Plagiarism detection, version comparison, A/B testing

---

## 📁 Project Structure

```
text-toxicity-analyzer/
│
├── frontend/                    # React 19 + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation with all routes
│   │   │   ├── ToxicityMeter.jsx       # Visual meter + safety labels
│   │   │   ├── WordImportance.jsx      # SHAP visualization
│   │   │   ├── DatasetStats.jsx        # Charts & stats
│   │   │   ├── NLPAnalysis.jsx         # Tabbed NLP analysis UI
│   │   │   ├── TextRewriter.jsx        # Toxic text rewriter UI
│   │   │   └── UI.jsx                  # Reusable UI components
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Analyzer.jsx            # Main analysis + NLP tools
│   │   │   ├── Dataset.jsx             # Data explorer
│   │   │   ├── Insights.jsx            # Data analysis page
│   │   │   ├── Compare.jsx             # Text comparison tool
│   │   │   └── Rewriter.jsx            # Toxic text rewriter page
│   │   ├── hooks/
│   │   │   ├── useToxicity.js          # TF.js model hook
│   │   │   └── useWordImportance.js    # Importance scoring
│   │   └── utils/
│   │       ├── nlp.js                  # NLP utilities (sentiment, POS, NER, etc.)
│   │       ├── rewriter.js             # Toxic text transformation logic
│   │       └── toxicity.js             # Toxicity scoring & labels
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # PHP 8.2 API
│   ├── api/
│   │   ├── dataset.php                 # CRUD operations
│   │   ├── stats.php                   # Dataset statistics
│   │   └── health.php                  # Health check
│   ├── config.php
│   ├── DynamoDBClient.php
│   └── router.php
│
├── scripts/                     # Data loading utilities
│   ├── load_dataset.py                 # Load ToxiGen to DynamoDB
│   └── requirements.txt
│
├── README.md
├── docker-compose.yml           # One-command setup
└── .gitignore
```

---

## 🔧 Key Implementation Details

### Word Importance Scoring (SHAP-Style)

Using perturbation-based analysis to explain predictions:

```javascript
// frontend/src/utils/importance.js

export async function calculateWordImportance(model, text) {
  const words = text.split(/\s+/);
  const baselinePrediction = await model.classify([text]);
  const baseScore = getMaxToxicity(baselinePrediction);

  const importance = [];

  for (let i = 0; i < words.length; i++) {
    // Remove word and measure impact
    const maskedText = words
      .map((w, idx) => (idx === i ? "[MASK]" : w))
      .join(" ");

    const maskedPrediction = await model.classify([maskedText]);
    const maskedScore = getMaxToxicity(maskedPrediction);

    // Importance = how much score drops when word is removed
    importance.push({
      word: words[i],
      score: baseScore - maskedScore,
      index: i,
    });
  }

  return importance.sort((a, b) => Math.abs(b.score) - Math.abs(a.score));
}
```

### Word Importance Visualization Component

```jsx
// frontend/src/components/WordImportance.jsx

export function WordImportance({ words }) {
  const getColor = (score) => {
    if (score > 0.5) return "bg-red-500 text-white";
    if (score > 0.2) return "bg-orange-400";
    if (score > 0) return "bg-yellow-200";
    if (score > -0.2) return "bg-green-100";
    return "bg-green-300";
  };

  return (
    <div className="flex flex-wrap gap-1 p-4">
      {words.map((item, idx) => (
        <span
          key={idx}
          className={`px-2 py-1 rounded ${getColor(item.score)}`}
          title={`Impact: ${(item.score * 100).toFixed(1)}%`}
        >
          {item.word}
        </span>
      ))}
    </div>
  );
}
```

### Dataset Statistics Endpoint

```php
// backend/api/stats.php

<?php
function getDatasetStatistics() {
    return [
        'total_count' => 274186,
        'toxic_count' => 132157,
        'non_toxic_count' => 142029,
        'toxic_percentage' => 48.2,
        'categories' => [
            'toxicity' => ['count' => 98234, 'pct' => 35.8],
            'insult' => ['count' => 67543, 'pct' => 24.6],
            'threat' => ['count' => 23456, 'pct' => 8.6],
            'identity_attack' => ['count' => 45678, 'pct' => 16.7],
            'obscene' => ['count' => 34567, 'pct' => 12.6],
            'sexual_explicit' => ['count' => 4892, 'pct' => 1.8]
        ]
    ];
}
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PHP 8.0+
- Python 3.8+ (for data loading)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/text-toxicity-analyzer.git
cd text-toxicity-analyzer

# Install frontend
cd frontend && npm install
```

### 2. Start Development Servers

**Terminal 1 — Frontend:**

```bash
cd frontend
npm run dev
```

**Terminal 2 — Backend:**

```bash
cd backend
php -S localhost:8000 router.php
```

### 3. Open Application

Navigate to **http://localhost:3000**

---

## 🎓 Skills Demonstrated

| Skill Area              | Implementation                                           |
| ----------------------- | -------------------------------------------------------- |
| **NLP/ML Integration**  | TensorFlow.js toxicity model, client-side inference      |
| **Explainable AI**      | SHAP-style word importance via perturbation analysis     |
| **Text Processing**     | Sentiment analysis, POS tagging, NER, keyword extraction |
| **Language Detection**  | Multi-language support with franc-min                    |
| **Text Transformation** | Toxic-to-constructive text rewriting                     |
| **Data Analysis**       | Dataset statistics, visualizations, filtering            |
| **React 19**            | Hooks, functional components, state management           |
| **PHP Backend**         | RESTful API, DynamoDB integration                        |
| **NoSQL Database**      | AWS DynamoDB data modeling                               |
| **Clean Architecture**  | Separation of concerns, reusable components              |

---

## 📈 Demo Scenarios

### Scenario 1: Analyze User Input

1. User enters text in the Analyzer page
2. TensorFlow.js model runs locally (no server call)
3. Results show toxicity scores per category
4. Word importance highlights which words triggered detection

### Scenario 2: Explore Dataset

1. User browses ToxiGen dataset
2. Filters by toxic/non-toxic labels
3. Views dataset statistics and charts
4. Searches for specific patterns

### Scenario 3: Understand Model Decisions

1. User sees a text flagged as toxic
2. Clicks "Explain" to see word importance
3. Visualizes which words contributed most
4. Understands model reasoning (not a black box)

### Scenario 4: Deep NLP Analysis

1. User enters text in the Analyzer page
2. Scrolls to NLP Analysis section with 10 tabs
3. Views sentiment (positive/negative), readability grade level
4. Explores POS tags, named entities, and emotions
5. Generates word cloud for visual frequency analysis

### Scenario 5: Rewrite Toxic Content

1. User navigates to the Rewriter page
2. Enters toxic or aggressive text
3. Clicks "Rewrite" to transform to constructive language
4. Views alternative phrasings and "safe insults"
5. Copies rewritten text for use in communications

### Scenario 6: Compare Two Texts

1. User navigates to the Compare page
2. Enters original text and revised version
3. Views similarity percentage score
4. Compares detailed statistics side-by-side
5. Identifies differences in word usage and style

---

## 📦 Dependencies

### Frontend

```json
{
  "@tensorflow/tfjs": "TensorFlow.js core",
  "@tensorflow-models/toxicity": "Pre-trained toxicity model",
  "compromise": "NLP library for POS tagging & NER",
  "sentiment": "Sentiment analysis",
  "franc-min": "Language detection",
  "keyword-extractor": "Keyword extraction",
  "string-similarity": "Text comparison"
}
```

---

## 📄 License

MIT License

---

**Built with ❤️ using React 19, TensorFlow.js, PHP, and DynamoDB**
