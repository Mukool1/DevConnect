# DevConnect

A full-stack MERN social network built for developers — follow other devs, share posts (with code snippets and images), like, comment, and get notified when someone engages with you.

**🔗 Live Demo:** [dev-connect-iota-roan.vercel.app](https://dev-connect-iota-roan.vercel.app/)

---

## ✨ Features

- **Authentication** — JWT stored in httpOnly cookies, passwords hashed with bcrypt
- **Forgot / reset password** — email-based reset flow via Nodemailer
- **Developer profiles** — bio, skills, social links (GitHub/LinkedIn/Twitter/portfolio), editable avatar
- **Follow system** — follow/unfollow other developers, view followers/following lists
- **Posts** — text posts with optional code snippets and images
- **Likes & comments** — with author-side notifications
- **Notifications** — see who followed, liked, or commented
- **Search** — find developers by name/username/skills, or posts by content
- **Image uploads** — avatars and post images stored via Cloudinary
- **404 page** — for unmatched routes
- **Dark mode** — full light/dark theme support

### 🚧 Planned
- Real-time notifications via Socket.io (currently REST/fetch-based)
- Direct messages (DMs)

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- lucide-react (icons)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt (auth)
- express-validator (input validation)
- Multer + Cloudinary (image uploads)
- Nodemailer (transactional email)

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## 📁 Project Structure

```
devconnect/
├── backend/
│   └── src/
│       ├── config/          # Cloudinary config
│       ├── controllers/     # Route handlers
│       ├── middlewares/     # Auth, validation, upload
│       ├── models/          # Mongoose schemas
│       ├── routes/          # Express routers
│       ├── utils/           # DB connection, email, token helpers
│       ├── validators/      # express-validator rule sets
│       ├── app.js
│       └── server.js
└── client/
    └── src/
        ├── api/              # Axios instance
        ├── components/       # Navbar, PostCard, FollowListModal, etc.
        ├── context/          # AuthContext, SocketContext, NotificationContext
        ├── pages/            # Login, Register, Feed, Profile, Notifications, Search, etc.
        ├── App.jsx
        └── main.jsx
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- A MongoDB connection string (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- A [Cloudinary](https://cloudinary.com/) account
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) generated (for Nodemailer)

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/devconnect.git
cd devconnect
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
```

Run the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../client
npm install
```

Create a `.env` file in `client/`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

Run the frontend:
```bash
npm run dev
```

The app will be running at `http://localhost:5173`, talking to the API at `http://localhost:5000`.


---

## 👤 Author

**Mukul Teotia**

---

## 📄 License

This project is open source and available for learning purposes.
