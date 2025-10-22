# Remember 2 Pack

A full-stack travel packing assistant that uses AI to help you remember what to pack for your trips.

## Overview

Remember 2 Pack is a web application that helps travelers create comprehensive packing lists by combining what you already know you need with AI-generated recommendations based on your trip details. Simply add items to your bag, describe your trip, and get personalized suggestions organized by category.

## Features

- **AI-Powered Recommendations** - Uses Claude and Hugging Face to generate personalized packing suggestions
- **Organized Categories** - Items sorted into clear categories like toiletries, clothing, electronics, and essentials
- **Smart Suggestions** - Reminds you of commonly forgotten items like chargers, medications, and travel documents
- **Save & Organize** - Save recommendations for future trips
- **User Authentication** - Secure user accounts with email verification
- **Responsive Design** - Works on desktop and mobile devices

## How It Works

1. Add Items - Start by adding items you already know you need to pack
2. Describe Your Trip - Tell us about your destination, activities, weather, and duration
3. Get AI Recommendations - Receive categorized suggestions based on your input

## Tech Stack

### Frontend
- **React 19** — Modern UI library for building interactive components  
- **Vite** — Fast development and build tool  
- **React Markdown** — Renders AI-generated responses in formatted markdown  

### Backend
- **Node.js** — JavaScript runtime environment  
- **Express.js** — Web framework for handling routes and APIs  
- **MongoDB** — NoSQL database managed with Mongoose ODM  
- **JWT** — JSON Web Tokens for secure authentication  
- **Bcrypt.js** — Password hashing for user security  

### Integrations & Services
- **Resend (SMTP)** — Transactional email delivery (used for verification & password reset)  
- **Dotenv** — Environment variable management  
- **CORS** — Cross-origin resource configuration  
- **AWS S3 + Rekognition** — Asset storage and image analysis for item detection  
- **Anthropic + Hugging Face** — AI providers with HF primary, Claude fallback

### Hosting & Deployment
- **Docker** — Containers for both frontend and backend
- **Docker Compose** — Local dev and production-style orchestration
- **Render** — Host both frontend and backend
- **GoDaddy** — Domain registration and forwarding

### Development Tools

- **VS Code** — Main code editor for full-stack development  
- **Postman** — API testing and debugging  
- **MongoDB Atlas** — GUI for visualizing and managing database data  
- **Render Logs** — Monitoring backend requests and deployments  
- **Cookie Editor (Chrome Extension)** — Testing authentication cookies and session persistence  
- **ChatGPT** — Debugging assistance and UI refinement
- **Git & GitHub** — Version control



### AI Integration
- Anthropic Claude - Fallback AI for recommendations
- Hugging Face - Primary AI service


## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/remember-2-pack.git
   cd remember-2-pack
   ```

2. Install dependencies
   ```bash
   npm run install:all
   ```

3. Set up environment variables

   Create `.env` files in both `frontend/` and `backend/` directories:

   Backend `.env`:
   ```env
   MONGODB_URI='your_mongodb_connection_string'
   JWT_SECRET='your_jwt_secret_key'
   NODE_ENV='development'
   SMTP_USER='based on your SMTP provider'
   SMTP_PASS='based on your SMTP provider'
   SENDER_EMAIL_OTP_VERIFY="otp-verification@your-domain.com"
   SENDER_EMAIL_OTP_RESET="otp-reset@your-domain.com"
   SENDER_EMAIL_WELCOME="welcome@your-domain.com"
   HF_API_KEY=hf_key
   ANTHROPIC_API_KEY=anthropic-key
   FRONTEND_URL=frontend-url
   BUCKET_NAME="your-bucket-name"
   BUCKET_REGION='your-chosen-aws-region'
   ACCESS_KEY='your-access-key-from-aws'
   SECRET_ACCESS_KEY='your-secret-aws-key'
   ```

   Frontend `.env`:
   ```env
   VITE_API_URL=http://localhost:3001
   ```

4. Start the development servers
   ```bash
   npm run dev
   ```

   This will start both frontend (http://localhost:5173) and backend (http://localhost:3001)

## Running with Docker

You can run both services with Docker Compose. The frontend will be available on http://localhost:3000 and the backend on http://localhost:3001.

- Development-like compose:
  ```bash
  docker compose up --build
  ```

- Production-like compose:
  ```bash
  docker compose -f docker-compose.prod.yml up --build -d
  ```

Notes:
- The dev compose mounts `./backend` into the backend container for live reload and passes `VITE_API_URL` build arg to the frontend image.
- Ensure `backend/.env` exists before starting compose (Compose uses `env_file: ./backend/.env`).

## Main Project Structure

```
remember-2-pack/
├── frontend/                    # React application (Vite)
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── styles/             # CSS stylesheets
│   │   ├── ai.js               # AI integration helper
│   │   └── main.jsx            # Application entry point
│   ├── public/                 # Static assets
│   └── package.json
├── backend/                     # Node.js/Express server
│   ├── server/
│   │   ├── config/             # Database and email configuration
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Custom middleware
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   └── index.js            # Server entry point
│   └── package.json
├── docker-compose.yml           # Local dev orchestration
├── docker-compose.prod.yml      # Production-like orchestration
├── package.json                 # Root package.json for workspace management
└── README.md
```

## API Endpoints

Base URL: `/api`

### Auth (`/api/auth`)
- `POST /register` — Register user
- `POST /login` — Login user
- `POST /logout` — Logout user
- `POST /send-verify-otp` — Send verification OTP (requires auth cookie)
- `POST /verify-account` — Verify account (requires auth cookie)
- `POST /is-auth` — Check auth status (requires auth cookie)
- `POST /send-reset-otp` — Send password reset OTP
- `POST /reset-password` — Reset password

### Recommendations store (`/api/recommendations`)
- `POST /save` — Save recommendation (requires auth)
- `GET /` — Get user recommendations (requires auth)
- `GET /:id` — Get recommendation by id (requires auth)
- `DELETE /:id` — Delete recommendation (requires auth)
- `GET /image/:key` — Get image URL by key (requires auth)

### Recommendation generation (`/api`)
- `POST /recommend` — Generate recommendations (requires auth)

### Chatbot (`/api/chatbot`)
- `POST /generate-question` — Generate clarifying questions
- `POST /refined-recommendation` — Generate refined recommendations

### Images (`/api/image`)
- `POST /upload-image` — Upload an image for processing (requires auth)
- `POST /confirm-upload` — Confirm image upload and process (requires auth)

### Health
- `GET /health` — Service health check

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Anthropic for providing Claude AI capabilities
- Hugging Face for additional AI model access
- React and Node.js communities for excellent documentation
- Open source contributors who make projects like this possible
