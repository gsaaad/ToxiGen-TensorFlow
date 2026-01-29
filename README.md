# Text Toxicity Analyzer

🛡️ A full-stack application for analyzing text toxicity using TensorFlow.js and the ToxiGen dataset.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![PHP](https://img.shields.io/badge/PHP-8.0+-777bb4?logo=php)
![TensorFlow](https://img.shields.io/badge/TensorFlow.js-4.17-ff6f00?logo=tensorflow)
![DynamoDB](https://img.shields.io/badge/AWS-DynamoDB-4053d6?logo=amazondynamodb)

## 🌟 Features

- **Real-time Text Analysis**: Analyze any text for toxicity using TensorFlow.js running in the browser
- **ToxiGen Dataset Explorer**: Browse and search the ToxiGen dataset with toxic/non-toxic annotations
- **Multiple Toxicity Categories**: Detection for identity attacks, insults, obscenity, threats, and more
- **Privacy-First**: All analysis happens client-side - your text never leaves your device
- **Demo Mode**: Works without AWS credentials for testing and demonstration

## 📸 Screenshots

### Home Page

The landing page introduces the application and its capabilities.

### Dataset Explorer

Browse the ToxiGen dataset with filtering and search functionality.

### Toxicity Analyzer

Enter any text and get instant toxicity scores across multiple categories.

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React 19 App   │────▶│   PHP Backend   │────▶│    DynamoDB     │
│  + TensorFlow   │     │      API        │     │    Database     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

- **Frontend**: React 19 + Vite + TailwindCSS + TensorFlow.js
- **Backend**: PHP 8.0+ REST API
- **Database**: AWS DynamoDB (or DynamoDB Local for development)
- **ML Model**: TensorFlow.js Toxicity Model

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PHP 8.0+
- Python 3.8+ (for data loading)
- Java Runtime (for DynamoDB Local) - optional

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/text-toxicity-analyzer.git
cd text-toxicity-analyzer
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Configure Backend

```bash
cd ../backend
cp .env.example .env
# Edit .env with your AWS credentials (optional - demo mode works without)
```

### 4. Start Development Servers

**Terminal 1 - Frontend:**

```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend:**

```bash
cd backend
php -S localhost:8000 router.php
```

### 5. Open the Application

Navigate to http://localhost:3000 in your browser.

## 📦 Loading the ToxiGen Dataset

### Option A: Use Demo Mode (No Setup Required)

The application works out of the box with sample data. Perfect for testing!

### Option B: Load Real Dataset to DynamoDB Local

1. **Install Python dependencies:**

   ```bash
   cd scripts
   pip install -r requirements.txt
   ```

2. **Set up DynamoDB Local:**

   ```bash
   python setup_local_dynamodb.py
   ```

3. **Start DynamoDB Local:**

   ```bash
   # Windows
   .\dynamodb_local\start-dynamodb.bat

   # Unix/Mac
   ./dynamodb_local/start-dynamodb.sh
   ```

4. **Load the dataset:**
   ```bash
   python load_dataset.py --local --create-table
   python load_dataset.py --local --upload --sample 1000
   ```

### Option C: Use AWS DynamoDB

1. **Configure AWS credentials:**

   ```bash
   # Set environment variables or configure ~/.aws/credentials
   export AWS_ACCESS_KEY_ID=your_key
   export AWS_SECRET_ACCESS_KEY=your_secret
   export AWS_REGION=us-east-1
   ```

2. **Create table and upload:**
   ```bash
   cd scripts
   python load_dataset.py --create-table
   python load_dataset.py --upload --sample 5000
   ```

## 🔧 Configuration

### Frontend (`frontend/vite.config.js`)

```javascript
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
```

### Backend (`backend/.env`)

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
DYNAMODB_TABLE=toxigen_dataset

# For local DynamoDB
DYNAMODB_ENDPOINT=http://localhost:8000
```

## 📁 Project Structure

```
text-toxicity-analyzer/
├── frontend/                 # React 19 application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # PHP API
│   ├── api/
│   │   ├── dataset.php      # Dataset endpoint
│   │   ├── health.php       # Health check
│   │   └── stats.php        # Statistics endpoint
│   ├── config.php           # Configuration
│   ├── DynamoDBClient.php   # DynamoDB wrapper
│   └── router.php           # Development router
│
├── scripts/                  # Python utilities
│   ├── load_dataset.py      # Dataset loader
│   ├── setup_local_dynamodb.py
│   └── requirements.txt
│
└── README.md
```

## 🧪 API Endpoints

| Endpoint           | Method | Description                               |
| ------------------ | ------ | ----------------------------------------- |
| `/api/dataset.php` | GET    | Fetch dataset with pagination and filters |
| `/api/health.php`  | GET    | Health check and system status            |
| `/api/stats.php`   | GET    | Dataset statistics                        |

### Query Parameters for `/api/dataset.php`

| Parameter | Type   | Default | Description                            |
| --------- | ------ | ------- | -------------------------------------- |
| `page`    | int    | 1       | Page number                            |
| `limit`   | int    | 20      | Items per page (max 100)               |
| `filter`  | string | all     | Filter by: `all`, `toxic`, `non-toxic` |
| `search`  | string | -       | Search text content                    |

## 🤖 Toxicity Categories

The TensorFlow.js toxicity model detects:

| Category            | Description                                   |
| ------------------- | --------------------------------------------- |
| **Identity Attack** | Negative statements targeting identity groups |
| **Insult**          | Insulting or provocative language             |
| **Obscene**         | Vulgar or profane language                    |
| **Severe Toxicity** | Extremely hateful or aggressive content       |
| **Threat**          | Intentions to cause harm                      |
| **Sexual Explicit** | Sexual references                             |
| **Toxicity**        | General toxicity score                        |

## 🛠️ Development

### Running Tests

```bash
# Frontend
cd frontend
npm run lint

# Backend (with PHPUnit if installed)
cd backend
php vendor/bin/phpunit
```

### Building for Production

```bash
cd frontend
npm run build
# Output in frontend/dist/
```

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [ToxiGen Dataset](https://huggingface.co/datasets/toxigen/toxigen-data) - Machine-generated toxic and benign content
- [TensorFlow.js Toxicity Model](https://github.com/tensorflow/tfjs-models/tree/master/toxicity) - Browser-based toxicity detection
- [HuggingFace Datasets](https://huggingface.co/docs/datasets/) - Dataset loading library

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Made with ❤️ using React, PHP, and TensorFlow.js
