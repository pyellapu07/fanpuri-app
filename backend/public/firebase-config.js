// Firebase configuration for admin panel
const firebaseConfig = {
  apiKey: "AIzaSyByyrrxyiJ0mCYfBtTm6Q0lxM9IIZ8FBwM",
  authDomain: "fanpuri-107aa.firebaseapp.com",
  projectId: "fanpuri-107aa",
  storageBucket: "fanpuri-107aa.firebasestorage.app",
  messagingSenderId: "435377399049",
  appId: "1:435377399049:web:ff2aa9bba5efd57db15fd8",
  measurementId: "G-G41BC6BHT7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = firebase.auth();

// Flag to prevent multiple reloads
let hasReloaded = false;

// Admin users (you can add more admin emails here)
const ADMIN_EMAILS = [
  'fanpuriofficial@gmail.com',
  'pradeepbarnalia123@gmail.com'
  // Add more admin emails as needed
];

// Check if user is admin
function isAdminUser(user) {
  return user && ADMIN_EMAILS.includes(user.email);
}

// Authentication state observer
auth.onAuthStateChanged(function(user) {
  // Check if we're already on the admin page
  const isOnAdminPage = document.querySelector('.header h1')?.textContent === 'Fanpuri Admin Dashboard';
  
  if (user) {
    if (isAdminUser(user)) {
      // User is admin, show admin panel
      if (!isOnAdminPage) {
        showAdminPanel();
      }
    } else {
      // User is not admin, show access denied
      showAccessDenied();
    }
  } else {
    // No user signed in, show login form
    if (!isOnAdminPage) {
      showLoginForm();
    }
  }
});

// Show login form
function showLoginForm() {
  document.body.innerHTML = `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    ">
      <div style="
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        width: 100%;
        max-width: 400px;
      ">
        <h1 style="text-align: center; margin-bottom: 30px; color: #333;">Fanpuri Admin Login</h1>
        
        <div id="loginForm">
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #555;">Email</label>
            <input type="email" id="email" placeholder="Enter your email" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #ddd;
              border-radius: 5px;
              font-size: 16px;
            ">
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #555;">Password</label>
            <input type="password" id="password" placeholder="Enter your password" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #ddd;
              border-radius: 5px;
              font-size: 16px;
            ">
          </div>
          
          <button onclick="login()" style="
            width: 100%;
            background: #007bff;
            color: white;
            padding: 12px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 15px;
          ">Login</button>
          
          <div id="errorMessage" style="
            color: #dc3545;
            text-align: center;
            margin-top: 10px;
            display: none;
          "></div>
        </div>
      </div>
    </div>
  `;
}

// Show access denied
function showAccessDenied() {
  document.body.innerHTML = `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    ">
      <div style="
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        text-align: center;
        max-width: 500px;
      ">
        <h1 style="color: #dc3545; margin-bottom: 20px;">Access Denied</h1>
        <p style="color: #666; margin-bottom: 30px;">
          You don't have permission to access the admin panel. 
          Please contact the administrator if you believe this is an error.
        </p>
        <button onclick="logout()" style="
          background: #6c757d;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
        ">Logout</button>
      </div>
    </div>
  `;
}

// Show admin panel
function showAdminPanel() {
  // Only reload if we're currently showing login/access denied and haven't reloaded yet
  if (!hasReloaded && (document.querySelector('#loginForm') || document.querySelector('h1')?.textContent === 'Access Denied')) {
    hasReloaded = true;
    window.location.reload();
  }
}

// Login function
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('errorMessage');
  
  try {
    await auth.signInWithEmailAndPassword(email, password);
    // Authentication state observer will handle the rest
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.style.display = 'block';
  }
}

// Logout function
function logout() {
  auth.signOut().then(() => {
    // Authentication state observer will handle the rest
  }).catch((error) => {
    console.error('Error signing out:', error);
  });
} 