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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Anthropic for providing Claude AI capabilities
- Hugging Face for additional AI model access
- React and Node.js communities for excellent documentation
