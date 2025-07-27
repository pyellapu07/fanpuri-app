# 🎨 Fanpuri - Fan Art Merchandise Store

A modern e-commerce platform for fan art and merchandise, built with React and Node.js.

## ✨ Features

- **Modern UI**: Clean, responsive design inspired by Funko
- **Product Management**: Admin panel for uploading and managing products
- **Artist Profiles**: Dedicated artist pages with their work
- **Shopping Cart**: Full cart functionality
- **Image Upload**: Support for multiple product images
- **Responsive Design**: Works perfectly on mobile and desktop

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Multer** - File upload handling
- **JSON Storage** - Simple data storage (no database required)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fanpuri-app
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Start the development servers**

   **Terminal 1 - Frontend:**
   ```bash
   npm start
   ```

   **Terminal 2 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - Admin Panel: http://localhost:5000/admin.html

## 📁 Project Structure

```
fanpuri-app/
├── public/                 # Static files
│   ├── assets/            # Images and videos
│   └── index.html         # Main HTML file
├── src/                   # React source code
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   └── App.js            # Main app component
├── backend/              # Node.js backend
│   ├── public/           # Admin interface
│   ├── uploads/          # Uploaded images
│   ├── data/             # JSON data files
│   └── server-simple.js  # Main server file
└── README.md
```

## 🎯 Key Features

### Admin Panel
- Upload products with multiple images
- Manage artists and products
- Feature/unfeature products
- Remove products with confirmation

### Product Management
- Artist association system
- Category and tag support
- Limited edition products
- Price and original price display

### User Interface
- Sticky navigation
- Responsive product carousel
- Modern card designs
- Smooth animations

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub account
   - Import your repository
   - Deploy automatically

### Backend Deployment (Render)

1. **Create Render account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy backend**
   - Create new Web Service
   - Connect your GitHub repo
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && node server-simple.js`
   - Deploy

3. **Update frontend API URL**
   - Replace `http://localhost:5000` with your Render URL
   - Redeploy frontend

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=production
```

## 📱 Mobile Support

- Fully responsive design
- Touch-friendly navigation
- Optimized for mobile browsing
- PWA ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for errors
2. Ensure all dependencies are installed
3. Verify both frontend and backend are running
4. Check the admin panel for data issues

---

**Built with ❤️ for the fan art community**
