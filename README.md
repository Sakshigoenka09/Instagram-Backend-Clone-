# VibeSync: Full-Stack Social Networking Platform

VibeSync is a high-performance web application that replicates core social networking functionalities with a focus on premium aesthetics and secure data management. The project is built using the MERN stack (MongoDB, Express, React, and Node.js) and features a custom-engineered design system that emphasizes glassmorphism and sophisticated user interactions.

## Technical Architecture

### Frontend
*   **React (Vite):** Utilized for component-based architecture and optimized build cycles.
*   **Dynamic UI Engine:** A proprietary design system built with Vanilla CSS, featuring custom HSL color palettes and smooth state transitions.
*   **State Management:** Managed through React Hooks for real-time interface updates.
*   **Responsive Layout:** Fully adaptive design optimized for mobile and desktop environments.

### Backend
*   **Node.js & Express:** Robust REST API architecture handling complex business logic and routing.
*   **MongoDB & Mongoose:** NoSQL document storage utilizing advanced population techniques for relational data management.
*   **Security Suite:** Implementation of JWT-based authentication and Bcrypt password hashing.
*   **Media Processing:** Multer integration for handling local file uploads and multi-part form data.
*   **SMTP Service:** Automated password recovery system integrated with Gmail's secure gateway.

## Core Features

### Identity and Authentication
*   **Secure Entry:** High-security login and registration flow with encrypted credential handling.
*   **Password Recovery:** A comprehensive "Forgot Password" workflow that generates and validates unique recovery codes via email.
*   **User Discovery:** Real-time search functionality allowing users to find and connect with peers.

### Engagement and Feed
*   **Smart Social Feed:** A personalized content stream that prioritizes posts from a user’s network.
*   **Interaction Engine:** Functional like and comment systems with immediate UI synchronization.
*   **Media Gallery:** Support for image uploads with high-fidelity previews.

### Network Management
*   **Network Graphs:** Implementation of following/follower logic with dynamic profile statistics.
*   **Privacy Control:** A tagging approval system where users must confirm being tagged in media before it appears on their profile.
*   **Content Control:** Post owners have full administrative capabilities to delete entries or update captions through secure modals.

## Deployment and CI/CD
*   **Vercel Integration:** Configured for automated deployment triggered by repository updates.
*   **Serverless Architecture:** Backend optimized to run as serverless functions for maximum scalability.
*   **Environment Safety:** Strict management of sensitive credentials through secure environment variables.

---

## Development Setup

1.  Clone the repository.
2.  Install dependencies for both folders: `npm install`.
3.  Configure your `.env` variables (MONGO_URI, JWT_SECRET, etc.).
4.  Run the development server: `npm run dev`.
