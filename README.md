# Final Year Project

## Overview
The Final Year Project is a comprehensive web-based platform designed to provide adaptive learning resources and personalized quizzes for users. It achieves this through an interactive frontend powered by React and TypeScript, and a backend implemented with Elysia and Redis. The platform includes features like quiz generation, learning roadmaps, topic explanations, and integration with external APIs for enriched educational content.

## Tech Stack
- **Frontend**: React + TypeScript, Vite, Tailwind CSS, Zustand
- **Backend**: Bun, Elysia, Redis
- **APIs**: Integration with Redis for caching, Google APIs for external services
- **Other Tools**: ESLint, TypeScript, TailwindCSS Animate

## Key Features
- Adaptive quiz generation based on user-selected topics.
- Personalized learning roadmaps based on user performance.
- Topic explanations improved with integrated YouTube video recommendations.
- Cache optimization using Redis for quicker response times.

---

## Setup Instructions

### Prerequisites
Ensure you have the following installed:
- Node.js and npm or Bun
- Redis server
- `bun` runtime (for the backend)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Start the server:
   ```bash
   bun run index.ts
   ```
4. Ensure .env variables for `REDIS_URL` and `FRONTEND_BASE_URL` are properly configured.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build the project for production:
   ```bash
   npm run build
   ```
5. Ensure the app's base URL corresponds to the backend's API endpoints.

---

## Project Structure
The project is organized as follows:
```
spark-learn/ (root)
├── backend/
│   ├── lib/         # Contains utility modules and reusable logic
│   ├── index.ts     # Main server entrypoint using Elysia
│   ├── package.json # Dependency configurations
│   └── READ.me       
├── frontend/
│   ├── src/         # React components and features
│   ├── public/      # Static assets for the app
│   ├── package.json # Dependency configurations
│   └── vite.config.ts
```

---

## Live Link
The live version of the app is available at [sparklearn.vercel.app](https://sparklearn.vercel.app)

## Contributing
1. Fork the repository and create a feature branch.
2. Adhere to conventional commits and write concise PR descriptions.
3. Run lint and tests before submitting a pull request:
   ```bash
   npm run lint
   ```
4. Ensure any changes in backend/frontend align with the project structure.

---

## License
This project is proprietary and not licensed for public distribution. Contact the repository owner for permissions.

--- 

