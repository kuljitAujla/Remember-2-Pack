# Remember 2 Pack

A full-stack travel packing assistant that uses AI to help you remember what to pack for your trips.

## Overview

Remember 2 Pack is a web application that helps travelers create comprehensive packing lists by combining what you already know you need with AI-generated recommendations based on your trip details. Simply add items to your bag, describe your trip, and get personalized suggestions organized by category.

## Features

- **AI-Powered Recommendations** - Uses Claude and Hugging Face to generate personalized packing suggestions
- **Organized Categories** - Items sorted into clear categories like toiletries, clothing, electronics, and essentials
- **Smart Suggestions** - Reminds you of commonly forgotten items like chargers, medications, and travel documents
- **Save & Organize** - Save recommendations for future trips and organize by destination
- **User Authentication** - Secure user accounts with email verification
- **Responsive Design** - Works on desktop and mobile devices

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
   ```

   Frontend `.env`:
   ```env
   VITE_API_URL=http://localhost:3001 // wherever you are runnning
   ```

4. Start the development servers
   ```bash
   npm run dev
   ```

   This will start both frontend (http://localhost:5173) and backend (http://localhost:3001)

## Project Structure

```
remember-2-pack/
├── frontend/                    # React application (Vite)
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/             # Page components
│   │   ├── styles/            # CSS stylesheets
│   │   ├── ai.js              # AI integration helper
│   │   └── main.jsx           # Application entry point
│   ├── public/                # Static assets
│   └── package.json
├── backend/                    # Node.js/Express server
│   ├── server/
│   │   ├── config/            # Database and email configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   └── index.js           # Server entry point
│   └── package.json
├── package.json               # Root package.json for workspace management
└── README.md
```

## Available Scripts

### Root Level Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run dev:frontend` | Start only the frontend development server |
| `npm run dev:backend` | Start only the backend development server |
| `npm run build` | Build the frontend for production |
| `npm run install:all` | Install dependencies for all projects |
| `npm run lint` | Run ESLint on the frontend |
| `npm start` | Start the production backend server |
| `npm run preview` | Preview the built frontend |

### Frontend Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Backend Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon (development) |
| `npm start` | Start production server |

## How It Works

1. Add Items - Start by adding items you already know you need to pack
2. Describe Your Trip - Tell us about your destination, activities, weather, and duration
3. Get AI Recommendations - Receive categorized suggestions based on your input

## Tech Stack

### Frontend
- React 19 - Modern UI library
- Vite - Fast build tool and dev server
- React Router - Client-side routing
- React Markdown - Markdown rendering for AI responses

### Backend
- Node.js - JavaScript runtime
- Express.js - Web framework
- MongoDB - Database with Mongoose ODM
- JWT - Authentication tokens
- Nodemailer - Email functionality

### AI Integration
- Anthropic Claude - Primary AI for recommendations
- Hugging Face - Fallback AI service

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset

### Recommendations
- `POST /api/recommend` - Get AI recommendations
- `POST /api/recommendations/save` - Save recommendations
- `GET /api/recommendations` - Get saved recommendations
- `DELETE /api/recommendations/:id` - Delete recommendation

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Deployment

### Frontend Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the `frontend/dist` folder to your hosting service

3. Set environment variables:
   - `VITE_API_URL` - Your backend API URL

### Backend Deployment

1. Set up your MongoDB database (MongoDB Atlas recommended)

2. Configure environment variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=https://your-frontend-domain.com
   ANTHROPIC_API_KEY=your_anthropic_api_key
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   NODEMAILER_EMAIL=your_email
   NODEMAILER_PASSWORD=your_app_password
   ```

3. Deploy your backend code

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Anthropic for providing Claude AI capabilities
- Hugging Face for additional AI model access
- React and Node.js communities for excellent documentation
- Open source contributors who make projects like this possible
