# Veedle Backend

A scalable and modular backend for a YouTube-like video-sharing platform, built with Node.js, Express.js, and MongoDB.

## 📌 Features

- User registration, login, and secure authentication (JWT)
- Upload and stream videos
- Like, dislike, comment on videos
- Playlist management
- Subscriptions and follower system
- Post-like feature using a "Tweet" section
- RESTful API structure with modular routing
- Media upload handling with Multer and Cloudinary
- Role-based authorization and middleware architecture

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **Media Storage:** Cloudinary
- **File Uploads:** Multer
- **Others:** dotenv, express-async-handler, morgan, cookie-parser

## 🚀 Advanced Features & Deployment

-**Aggregation Pipelines:** MongoDB aggregation pipelines power advanced querying, text search, and efficient pagination.
-**Containerization:** The entire backend is containerized with Docker for consistent, portable deployments.
-**Kubernetes Ready:** Includes deployment.yml and service.yml manifests for horizontal scaling and orchestration in Kubernetes clusters.
-**CI/CD:** Automated build and deployment pipeline using GitHub Actions for continuous delivery.

-**Deployment:**
  -Backend: Hosted on Render (supports both Docker image and direct GitHub integration)
  -Frontend: [Veedle](https://your-frontend-link.com)



