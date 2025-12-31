# Safe360

Safe360 is a **Software Development Company** website built using the MERN stack (MongoDB, Express.js, React, Node.js). It showcases the company's services, products, and career opportunities, while providing an admin dashboard for content management.

## Features

- **Corporate Website**: Pages for Home, About Us, Services, Products, Careers, and Contact.
- **Service Showcase**: Details about software development services offered.
- **Product Portfolio**: Display of the company's software products.
- **Career Portal**: Listing of job openings and application forms.
- **Admin Dashboard**: comprehensive backend for managing:
  - Users
  - Career listings
  - Contact messages
  - Blog posts
- **User Authentication**: Secure login for administrators.
- **Responsive Design**: Modern UI optimized for all devices.

## Project Structure

The project is divided into two main folders:

- `client/`: The React frontend application (Vite).
- `server/`: The Node.js/Express backend API.

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Git](https://git-scm.com/)

## Installation & Setup

### 1. Backend (Server) Setup

1.  Navigate to the server directory:

    ```bash
    cd server
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the `server` root directory. You must configure the `PORT` to **5001** because the client application is hardcoded to communicate with this port.

    **`.env` file example:**

    ```env
    MONGO_URI=mongodb://localhost:27017/safe360  # Replace with your MongoDB connection string
    PORT=5001                                     # REQUIRED: Client expects API on port 5001
    JWT_SECRET=your_super_secret_key              # Replace with a secure secret key
    ```

4.  Start the server:
    ```bash
    npm run dev
    ```
    _The server should now be running on `http://localhost:5001`._

### 2. Frontend (Client) Setup

1.  Open a new terminal and navigate to the client directory:

    ```bash
    cd client
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Start the development server:

    ```bash
    npm run dev
    ```

4.  Open your browser and verify the application (usually running at `http://localhost:5173` or `http://localhost:5174`).

## Usage

- **Public Facing Site**: Explore Safe360's services, products, and blogs.
- **Admin Panel**: Access via `/admin/login` to manage site content.
- **API Endpoints**: The backend exposes API routes at `http://localhost:5001/api/...`.

## Troubleshooting

- **Client fetching errors**: Ensure the **Server** is running specifically on port **5001**. If it runs on 5000 (default), the client will fail to fetch data.
- **Database connection error**: Verify your `MONGO_URI` in the server `.env` file is correct and your MongoDB instance is running.
