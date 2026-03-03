# MedPrompt 🏥

> AI-powered medical document analysis — understand your lab reports, prescriptions, and scans in plain language.

## Features

- 🔬 **Lab Report Analysis** — Blood tests, urine analysis, and pathology reports explained clearly
- 🩻 **Scan & X-ray** — CT scans, X-rays, MRIs analyzed and summarized
- 💊 **Prescriptions** — Decode handwritten prescriptions with medicine names and dosages
- 🌐 **4 Languages** — English, Telugu, Hindi, Tamil
- 🎤 **Voice Input** — Speak your symptoms or describe your document
- 🔒 **Secure & Private** — JWT authentication, per-user data isolation
- 🪪 **MedID System** — Each user gets a unique 6-character Medical ID (e.g., `GUT491`)
- 👨‍💼 **Admin Panel** — Search users by MedID, view their documents

## Project Structure

```
MedPrompt-/
├── frontend/          # Next.js 14 + TypeScript + Tailwind CSS
├── backend/           # FastAPI + MongoDB (Motor) + LiteLLM
├── .gitignore
└── README.md
```

## Tech Stack

### Backend
- **FastAPI** — Modern Python web framework
- **MongoDB** + **Motor** — Async database
- **python-jose** — JWT authentication
- **passlib[bcrypt]** — Password hashing
- **LiteLLM** — LLM-agnostic AI integration (OpenAI, etc.)
- **pdfplumber** + **pytesseract** — PDF and image OCR

### Frontend
- **Next.js 14** — React framework with App Router
- **TypeScript** — Type-safe code
- **Tailwind CSS** — Utility-first styling with dark mode
- **Zustand** — Lightweight state management
- **Axios** — HTTP client
- **jsPDF** — Client-side PDF generation

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB running locally or MongoDB Atlas URI
- An LLM API key (OpenAI, etc.)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URL, JWT secret, and LLM API key

# Start the server
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017/medprompt` |
| `JWT_SECRET` | Secret key for JWT tokens | — |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `JWT_EXPIRATION_HOURS` | Token expiry in hours | `24` |
| `LLM_MODEL` | LiteLLM model name | `gpt-3.5-turbo` |
| `LITELLM_API_KEY` | API key for LLM provider | — |
| `UPLOAD_DIR` | File upload directory | `./uploads` |
| `ADMIN_EMAIL` | Email that gets admin role | — |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:3000` |

### Frontend (`frontend/.env.local`)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user info |

### Documents
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/analyze` | Analyze a medical document |
| GET | `/api/documents/history` | Get user's document history |
| GET | `/api/documents/{id}` | Get a specific document |
| GET | `/api/documents/{id}/download` | Download original file |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/users/search?medid=XXX` | Search user by MedID |
| GET | `/api/admin/users/{medid}/documents` | Get user's documents |
| GET | `/api/admin/documents/{id}/download` | Download any file |

## Input Modes

1. **Text** — Paste report text directly
2. **File** — Upload PDF, JPG, PNG (OCR + PDF text extraction)
3. **Voice** — Browser-based speech recognition (supports 4 languages)

## MedID System

Each registered user receives a unique 6-character Medical ID in format `AAA999` (3 uppercase letters + 3 digits). This ID is used to:
- Identify patients uniquely
- Allow admin to look up users quickly
- Reference in downloaded PDF reports

## Disclaimer

⚠️ **MedPrompt is for informational purposes only.** Always consult with qualified healthcare professionals for medical advice, diagnosis, and treatment decisions.

## License

MIT
