# 📝 Text Sharing Application

A full-stack text-sharing web application that allows users to share text snippets via unique URLs. Features user authentication for logged-in users and anonymous sharing for guests.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with JWT tokens
- 👤 **Anonymous Sharing** - Share text without creating an account
- 🔗 **Unique URLs** - Each paste gets a unique UUID-based shareable link
- 📜 **History Dashboard** - View and manage all your pastes (logged-in users only)
- 🗑️ **Delete Pastes** - Remove your own pastes
- 📋 **Copy to Clipboard** - One-click copy functionality
- 🌙 **Dark Mode** - Toggle between light and dark themes (preference saved)
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔒 **Secure** - Password hashing, SQL injection protection, token authentication

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Bootstrap 5** - CSS framework
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **UUID** - Unique ID generation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** or **yarn** - Package manager

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd text-sharing-app
```

### 2. Database Setup

Open MySQL and create the database:
```sql
-- Create database
CREATE DATABASE text_sharing_app;
USE text_sharing_app;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pastes table
CREATE TABLE pastes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    user_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_uuid (uuid),
    INDEX idx_user_id (user_id)
);
```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=text_sharing_app
# JWT_SECRET=your_super_secret_jwt_key_change_this
# PORT=5000
```

**Create `backend/.env` file:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=text_sharing_app
JWT_SECRET=change_this_to_a_random_secret_key
PORT=5000
```

**Start the backend server:**
```bash
npm start
# or for development with auto-reload
npm run dev
```

Backend will run on `http://localhost:5000`

### 4. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📁 Project Structure
```
text-sharing-app/
├── backend/
│   ├── node_modules/
│   ├── .env                 # Environment variables (not in git)
│   ├── .gitignore
│   ├── db.js               # Database connection
│   ├── server.js           # Express server and API routes
│   ├── package-lock.json
│   └── package.json
│
└── frontend/
    ├── node_modules/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx       # Login page
    │   │   ├── Signup.jsx      # Signup page
    │   │   ├── MainPage.jsx    # Main editor and history
    │   │   └── ViewPaste.jsx   # View shared paste
    │   ├── App.jsx             # Main app component
    │   ├── main.jsx            # Entry point
    │   └── darkmode.css        # Dark mode styles
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🎯 Usage

### For Anonymous Users

1. Visit `http://localhost:3000`
2. Paste or write your text in the text area
3. Click "🔗 Share" button
4. Copy the generated URL and share it with anyone
5. Anyone with the link can view the text

### For Registered Users

1. Click "Sign Up" and create an account
2. Login with your credentials
3. Share text like anonymous users
4. View all your pastes in the "Your Pastes" section
5. Click "View" to see a paste or "Delete" to remove it
6. Your paste history is saved and accessible after login

### Dark Mode

- Click the 🌙/☀️ button in the top-right corner
- Your preference is automatically saved
- Works across all pages

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Create new user | No |
| POST | `/api/auth/login` | Login user | No |

### Pastes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/pastes` | Create new paste | Optional |
| GET | `/api/pastes/:uuid` | Get paste by UUID | No |
| GET | `/api/pastes` | Get user's pastes | Yes |
| DELETE | `/api/pastes/:uuid` | Delete paste | Yes |

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token authentication (7-day expiry)
- ✅ SQL injection protection (parameterized queries)
- ✅ CORS enabled
- ✅ Secure password validation
- ✅ Token-based authorization
- ✅ User data isolation

## 🌐 Environment Variables

### Backend `.env`
```env
DB_HOST=localhost           # MySQL host
DB_USER=root               # MySQL username
DB_PASSWORD=password       # MySQL password
DB_NAME=text_sharing_app   # Database name
JWT_SECRET=secret_key      # JWT secret (change this!)
PORT=5000                  # Backend port
```

## 📦 Production Build

### Frontend
```bash
cd frontend
npm run build
```

Build output will be in `frontend/dist/`

### Backend

For production deployment:

1. Set `NODE_ENV=production`
2. Use environment variables (not `.env` file)
3. Enable HTTPS
4. Configure CORS for your domain
5. Add rate limiting
6. Use a process manager (PM2)
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name text-sharing-backend
```

## 🚀 Deployment

### Backend Deployment (Example with Heroku)
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add MySQL addon (JawsDB or ClearDB)
heroku addons:create jawsdb:kitefin

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main
```

### Frontend Deployment (Example with Vercel/Netlify)

1. Update `API_URL` in `App.jsx` to your backend URL
2. Run `npm run build`
3. Deploy `dist/` folder to Vercel, Netlify, or any static host

## 🧪 Testing
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 🐛 Troubleshooting

### MySQL Connection Error

- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
```

### CORS Errors

- Ensure backend CORS is configured
- Check frontend API_URL matches backend

### Dark Mode Not Working

- Clear browser cache
- Check `darkmode.css` is imported
- Verify localStorage is enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Your Name - [@yourhandle](https://twitter.com/yourhandle)

## 🙏 Acknowledgments

- Bootstrap for the UI framework
- React team for the amazing library
- MySQL for the robust database
- Express.js for the backend framework

## 📞 Support

For support, email multimeter311201@gmail.com or open an issue in the repository.

---

**Made with ❤️ and ☕**
