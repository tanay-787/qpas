# QPAS: Question Paper Archives System

QPAS (Question Paper Archives System) is an advanced, role-based web application designed to serve educational institutions, faculty, and students by providing a centralized digital repository for examination question papers. Its goal is to enhance exam preparation for students and streamline the process of question paper management and reuse for educators.

---

## 🌐 Live Demo

[Access QPAS](https://qpas.onrender.com/)

## 🖥️ Project Presentation

[View the Project Presentation](https://gamma.app/docs/QPAS-jpc756so8dct1x2)

---

## Key Features

- **Centralized Repository:** Securely stores question papers from multiple institutions in a single, searchable archive.
- **Role-Based Access Control:** Fine-grained role management for students, teachers, and administrators.
- **Efficient Paper Management:** Teachers and admins can upload, update, and delete question papers in multiple formats (PDF, DOCX, etc.).
- **Advanced Search & Filters:** Students can quickly search and filter papers by subject, exam type, degree, or institution.
- **Access Management:** Papers can be marked as public or private, with tailored access based on user roles and institution.
- **Modern UI/UX:** Intuitive dashboards for each user role, real-time notifications, and responsive layouts.
- **Secure & Auditable:** All actions are authenticated and authorized, ensuring data integrity and privacy.
- **Reusable Content:** Enables educators to reuse and adapt existing question papers, reducing preparation time and effort.
- **Academic Enrichment:** Students gain access to diverse past papers, supporting comprehensive exam readiness.

---

## System Architecture

QPAS features a modern full-stack architecture:

- **Frontend:**  
  - Built with **React** (using Vite or Create React App) and **React Router** for SPA routing.
  - State management via **Context API** and **React Query** for API state and caching.
  - Modular component-based design with reusable UI elements.
  - Responsive layouts for seamless experience across devices.
- **Backend:**  
  - RESTful API developed with **Node.js** and **Express.js**.
  - **Firebase (Firestore and Storage)** for scalable, secure data and file management.
  - Comprehensive middleware for authentication (JWT), role-based authorization, and request validation.
- **Authentication & Authorization:**  
  - Secure JWT-based authentication.
  - Role checks and user context extraction in all protected routes.
- **Deployment:**  
  - Cloud-based deployment leveraging [Render.com](https://qpas.onrender.com/) for demo and production.
  - Environment configuration via `.env` files.

---

## Core Modules

### Frontend

- **Authentication:** Sign up, log in, and persistent user sessions.
- **Dashboards:**
  - _Student Dashboard:_ Search, view, and download question papers.
  - _Teacher Dashboard:_ Upload, manage, and update personal and institutional question papers.
  - _Admin Dashboard:_ Institution-wide management of users and papers.
- **Paper Management:**  
  - Upload new papers with metadata (subject, exam type, access type, etc.).
  - Edit or delete existing papers (with audit checks).
  - Filter and search functionality for efficient navigation.
- **Reusable UI Components:** Modal dialogs, cards, badges, notifications, etc.

### Backend

- **RESTful Endpoints:**  
  - CRUD operations for question papers (`/api/question-papers/`).
  - Role-based endpoints for teachers and admins.
- **File Handling:**  
  - Uploads with validation and secure storage in Firebase.
  - Generation of signed URLs for private document access.
- **Security:**  
  - JWT verification and user context extraction.
  - Fine-grained access control for all actions.

---

## Technology Stack

- **Frontend:** React, React Router, Context API, React Query, Axios, modern component libraries
- **Backend:** Node.js, Express.js, Firebase (Firestore & Storage)
- **Authentication:** JWT (JSON Web Token)
- **State Management:** React Context, React Query
- **Deployment:** Render.com

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Firebase project (with Firestore and Storage enabled)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tanay-787/qpas.git
   cd qpas
   ```

2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. **Configure Environment:**
   - Copy `.env.example` to `.env` in both frontend and backend, and update with your Firebase and JWT settings.

4. **Run the app locally:**
   - Start backend:
     ```bash
     cd backend
     npm run dev
     ```
   - Start frontend:
     ```bash
     cd ../frontend
     npm run dev
     ```

5. **Access the app:**  
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Contribution Guidelines

Contributions are welcome! Please submit issues or pull requests for enhancements, bug fixes, or new features.
