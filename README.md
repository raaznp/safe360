# Safe360 - Enterprise Safety Training Platform

Safe360 is a comprehensive web application for managing enterprise safety training, products, and services. It features a modern MERN stack architecture with a robust backend API and a dynamic React frontend.

## 🚀 Features

- **Corporate Website**: Dynamic pages for Home, About, Services, Products, and Careers.
- **Content Management System (CMS)**:
  - **Blog Management**: Create, edit, and publish safety articles with author attribution.
  - **Job Board**: Manage career listings and review job applications.
  - **Team Management**: Update team member profiles and roles.
  - **Page Content**: Edit static page content via the admin dashboard.
- **User Management**: Admin authentication, profile management, and role-based access.
- **Media Library**: Manage uploaded images and documents.
- **Analytics**: Dashboard overview of site activity and content metrics.
- **SEO Optimized**: Built-in meta tag management for better search engine visibility.

## 🛠 Tech Stack

- **Frontend**: React (Vite), TailwindCSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens), Argon2
- **Testing**: Node.js native test scripts

## 📂 Project Structure

```
Safe360/
├── automation/                 # Automation Scripts (Not for deployment)
│   ├── generate-pdfs.js        # PDF Generation
│   └── generate-screenshots.js # Screenshot Capture
├── client/                     # React Frontend Application
│   ├── public/                 # Static Assets (favicon, manifest)
│   ├── src/                    # Application Source Code
│   │   ├── components/         # Reusable UI Components
│   │   ├── context/            # Global Context Providers
│   │   ├── pages/              # Page Components (Routes)
│   │   └── ...
│   ├── index.html              # HTML Entry Point
│   ├── vite.config.js          # Vite Bundler Configuration
│   ├── tailwind.config.js      # TailwindCSS Configuration
│   └── postcss.config.js       # PostCSS Configuration
├── server/                     # Node.js/Express Backend
│   ├── middleware/             # Custom Middleware (Auth, Uploads)
│   ├── models/                 # Mongoose Database Schemas
│   ├── routes/                 # API Endpoint Definitions
│   ├── test_cases/             # Validation & Test Scripts
│   ├── uploads/                # Local File Storage (Media/Docs)
│   ├── server.js               # Server Entry Point
│   └── env.example             # Environment Variable Template
├── .gitignore                  # Git Ignored Files
├── eslint.config.js            # Code Linting Configuration
└── README.md                   # Project Documentation
```

## ⚙️ Prerequisites

- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local instance running on port 27017 or a MongoDB Atlas connection string.
- **Git**: For version control.

## 📦 Installation & Setup

### 1. Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Environment Configuration**:
    - Copy the example environment file:
      ```bash
      cp env.example .env
      ```
      _(Windows: `copy env.example .env`)_
    - Open `.env` and configure your settings:
      ```env
      MONGO_URI=mongodb://localhost:27017/safe360
      PORT=5001  # Must be 5001 for client compatibility
      JWT_SECRET=your_secure_secret_key_here
      ```
4.  (Optional) Seed Application Data:
    Populate the database with initial users, jobs, and blog posts:
    ```bash
    node test_cases/scripts/seed.js
    ```
5.  Start the Development Server:
    ```bash
    npm run dev
    ```
    _Server will start on `http://localhost:5001`_

### 2. Frontend Setup

1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Development Server:
    ```bash
    npm run dev
    ```
4.  Open your browser to the URL shown (usually `http://localhost:5173`).

### 3. Admin Access

- **Login URL**: `/admin/login`
- **Default Credentials** (if seeded):
  - Username: `admin`
  - Password: `password123`

## 🧪 Running Tests

Safe360 includes a suite of verification scripts located in `server/test_cases`.

### Comprehensive Test

To check all core forms (Contact, User, Team, etc.) at once:

```bash
cd server
node test_cases/scripts/test_missing_forms.js
```

### Specific Tests

Run individual scripts for targeted testing:

- **Blog Flow**: `node test_cases/scripts/test_blog_flow.js`
- **Media Uploads**: `node test_cases/scripts/test_media_features.js`
- **Privacy Policy**: `node test_cases/scripts/update_privacy_policy.js`

## 📝 Troubleshooting

- **Database Connection Failed**: Ensure your MongoDB server is running. If using Atlas, check your IP whitelist.
- **Login fails**: Verify you have seeded the `admin` user or check the console for JWT errors.
- **Images not loading**: Check `server/uploads` permissions and ensure `PORT` matches the client's API URL configuration.

---

_Verified Environment: Windows 11, Node v18+, MongoDB v6.0_
