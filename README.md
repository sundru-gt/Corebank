# CoreBank

CoreBank is a modern, full-stack web application designed to simulate core banking functionalities. It features a premium, minimalist UI and allows users to manage their accounts and perform transactions securely.

## 🚀 Features

- **User Authentication:** Secure registration and login.
- **Account Management:** Users can open new accounts and check their balances on demand.
- **Transactions:** Transfer funds securely between accounts.
- **Modern UI:** A sleek, lightweight, and responsive design built with Tailwind CSS, utilizing high-contrast typography and minimalist aesthetics.

## 💻 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Lucide React (Icons)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication & Email:** JWT, bcrypt, Nodemailer (with OAuth2)

## 📁 Project Structure

The project is organized into two main directories:

- `/frontend` - Contains the React application.
- `/backend` - Contains the Express server and API logic.

## 🛠️ Getting Started

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Setup the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `backend` directory and add the following variables (update them with your actual configuration):
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_ID=your_google_oauth_client_id
   CLIENT_SECRET=your_google_oauth_client_secret
   REFRESH_TOKEN=your_google_oauth_refresh_token
   EMAIL_USER=your_email_address
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Setup the Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

### 3. Usage
Once both servers are running, open the local URL provided by Vite (usually `http://localhost:5173`) in your browser to access the application. Register for a new account to explore the dashboard and make transactions.

## 👨‍💻 Author

Made by **Shivendru Paul**.
