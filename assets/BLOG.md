# QPAS – Revolutionizing Question Paper Management for Institutions

When I built **QPAS** (Question Paper Archives System), my goal was to address a pressing need in educational institutions: the lack of a centralized, easy-to-use platform for managing and accessing question papers. QPAS is more than just a repository; it’s a modern, role-based solution that simplifies academic processes for students, teachers, and administrators alike.

## Why QPAS?

In most institutions, question papers are scattered across various platforms or stored in physical archives, making access cumbersome and time-consuming. QPAS aims to solve this by creating a **centralized digital repository** that ensures question papers are always accessible, secure, and easy to manage.

## What Makes QPAS Unique?

Beyond being a storage solution, QPAS is built to enhance productivity and accessibility:

* 🗂️ **Centralized Repository** – Store question papers securely in one searchable archive, accessible to multiple institutions.
* 🔑 **Role-Based Access Control** – Tailored user experiences for students, teachers, and administrators, with fine-grained access permissions.
* 🔍 **Advanced Search & Filters** – Quickly find papers by subject, exam type, degree, or institution.
* 🔒 **Access Management** – Control access levels (public or private) based on user roles and institutional preferences.
* 📚 **Reusable Content** – Teachers can adapt existing question papers, reducing preparation time.

![QPAS Dashboard](./qpas-dashboard.png)
*Intuitive dashboards tailored for different user roles.*

![Search Functionality](./qpas-search.png)
*Advanced search and filter options for quick navigation.*

![Paper Upload Feature](./qpas-upload.png)
*Effortless upload and management of question papers.*

## Core Features

* **Authentication & Authorization** – Secure JWT-based login with role-based access.
* **Dashboards** – Intuitive interfaces for students, teachers, and admins, with features like search, upload, and management.
* **Paper Management** – Teachers and admins can upload, update, and delete question papers in multiple formats (PDF, DOCX, etc.).
* **Responsive UI** – Seamless experience across devices, ensuring accessibility anytime, anywhere.

## How I Built It

* **Frontend**: Built with React, React Router, and modern component libraries. State management is handled using Context API and React Query for efficient API state and caching.
* **Backend**: Developed using Node.js and Express.js. Firebase handles scalable data and file management, ensuring security and reliability.
* **Authentication**: JWT-based with role checks and user context in all protected routes.
* **Deployment**: Hosted on **Vercel**, ensuring a smooth and scalable deployment pipeline.

## Technology Stack

* **Frontend**: React, React Router, Context API, React Query, Axios
* **Backend**: Node.js, Express.js, Firebase (Firestore & Storage)
* **Authentication**: JSON Web Tokens (JWT)
* **Deployment**: Vercel

## Lessons Learned

* The importance of **role-based access control** in creating a secure and user-friendly system.
* How to integrate **Firebase** effectively for scalable file storage and database management.
* Balancing **usability and functionality** when designing a multi-role application.
* The end-to-end process of developing, deploying, and maintaining a full-stack web application.

QPAS is a project I’m incredibly proud of, and I believe it has the potential to transform how educational institutions manage their question papers. If you’d like to explore it, feel free to check out the [live demo here](https://qpas.vercel.app/) or view the [project presentation](https://gamma.app/docs/QPAS-jpc756so8dct1x2).