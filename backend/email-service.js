const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Email configuration
const emailConfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'fanpuriofficial@gmail.com',
    pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Function to convert image to base64 with compression
async function imageToBase64(imagePath) {
  try {
    const imageBuffer = await fs.readFile(imagePath);
    const base64String = imageBuffer.toString('base64');
    const mimeType = 'image/png'; // Assuming PNG format
    
    // Check if the base64 string is too large (Gmail has limits)
    if (base64String.length > 1000000) { // ~1MB limit
      console.log('⚠️ Logo is too large for email, using fallback URL');
      return null;
    }
    
    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
}

// Optimized Welcome email template with logo
const welcomeEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Fanpuri</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { background: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 1px solid #e2e8f0; }
        .logo-section { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 20px; }
        .logo { max-width: 150px; height: auto; }
        .account-created { font-size: 1rem; font-weight: 600; color: #3b82f6; text-transform: uppercase; }
        .content { padding: 30px 20px; }
        .greeting { font-size: 1.3rem; font-weight: 600; color: #1e293b; margin-bottom: 15px; }
        .message { font-size: 1rem; color: #475569; margin-bottom: 25px; line-height: 1.6; }
        .cta-button { display: inline-block; background: #3b82f6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 1rem; margin: 15px 0; }
        .account-info { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0; }
        .account-info p { color: #475569; margin: 0; font-size: 0.9rem; }
        .account-info .email { color: #3b82f6; font-weight: 600; }
        .closing { margin: 20px 0; }
        .closing p { color: #475569; margin: 5px 0; }
        .footer { background-color: #f1f5f9; color: #475569; padding: 20px; text-align: center; }
        .social-links { margin-bottom: 15px; }
        .social-links a { display: inline-block; margin: 0 8px; color: #64748b; text-decoration: none; font-size: 1.1rem; }
        .footer-links { margin-bottom: 15px; }
        .footer-links a { color: #64748b; text-decoration: none; margin: 0 10px; font-size: 0.8rem; }
        .copyright { color: #94a3b8; font-size: 0.7rem; margin-top: 15px; }
        @media (max-width: 600px) {
            .content { padding: 20px 15px; }
            .header { padding: 20px 15px; }
            .logo-section { flex-direction: column; gap: 15px; }
            .logo { max-width: 120px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-section">
                <img src="{{logoUrl}}" alt="FANPURI" class="logo">
                <div class="account-created">NEW ACCOUNT CREATED</div>
            </div>
        </div>
        
        <div class="content">
            <div class="greeting">Hi {{userName}},</div>
            
            <div class="message">
                Welcome to Fanpuri! 🎉 We're thrilled to have you join our vibrant community of fan art enthusiasts, creators, and collectors. You're now part of a world where creativity knows no bounds and every piece tells a story.
            </div>
            
            <div style="text-align: center;">
                <a href="{{shopUrl}}" class="cta-button">Start Collecting</a>
            </div>
            
            <div class="account-info">
                <p>Just in case this is helpful in the future, you have signed up as <span class="email">{{userEmail}}</span>.</p>
            </div>
            
            <div class="closing">
                <p>Best Wishes,</p>
                <p><strong>Your friends at Fanpuri</strong></p>
            </div>
        </div>
        
        <div class="footer">
            <div class="social-links">
                <a href="https://instagram.com/fanpuri" title="Instagram">📷</a>
                <a href="https://twitter.com/fanpuri" title="Twitter">🐦</a>
                <a href="https://facebook.com/fanpuri" title="Facebook">📘</a>
                <a href="https://youtube.com/fanpuri" title="YouTube">📺</a>
                <a href="https://tiktok.com/@fanpuri" title="TikTok">🎵</a>
            </div>
            
            <div class="footer-links">
                <a href="{{helpUrl}}">Help Center</a>
                <a href="{{contactUrl}}">Contact Us</a>
                <a href="{{privacyUrl}}">Privacy Policy</a>
                <a href="{{termsUrl}}">Terms of Service</a>
            </div>
            
            <div class="copyright">
                © 2024 Fanpuri. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
`;

// Compile the template
console.log('🔄 Compiling updated email template with logo...');
const compiledTemplate = handlebars.compile(welcomeEmailTemplate);
console.log('✅ Updated email template compiled successfully');

// Send welcome email
async function sendWelcomeEmail(userData) {
  try {
    const {
      email,
      displayName,
      photoURL,
      creationTime
    } = userData;

    // Format the join date
    const joinDate = new Date(creationTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Prepare template data
    const templateData = {
      userName: displayName || email.split('@')[0],
      userEmail: email,
      joinDate: joinDate,
      logoUrl: 'https://via.placeholder.com/200x80/3b82f6/ffffff?text=FANPURI',
      shopUrl: process.env.FRONTEND_URL || 'https://fanpuri.com/shop',
      helpUrl: process.env.FRONTEND_URL || 'https://fanpuri.com/help',
      contactUrl: process.env.FRONTEND_URL || 'https://fanpuri.com/contact',
      privacyUrl: process.env.FRONTEND_URL || 'https://fanpuri.com/privacy',
      termsUrl: process.env.FRONTEND_URL || 'https://fanpuri.com/terms'
    };

    // Generate HTML content
    console.log('📧 Generating email with updated template and logo...');
    const htmlContent = compiledTemplate(templateData);
    console.log('✅ Updated email HTML generated');

    // Email options
    const mailOptions = {
      from: `"Fanpuri Team" <${emailConfig.auth.user}>`,
      to: email,
      subject: 'New Account Confirmation from Fanpuri',
      html: htmlContent,
      text: `Hi ${templateData.userName},\n\nWelcome to Fanpuri! We're thrilled to have you join our vibrant community of fan art enthusiasts, creators, and collectors.\n\nStart exploring: ${templateData.shopUrl}\n\nBest wishes,\nYour friends at Fanpuri`
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Updated welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending updated welcome email:', error);
    return { success: false, error: error.message };
  }
}

// Optimized Artist Welcome Email Template
const artistEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Fanpuri</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { background: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 1px solid #e2e8f0; }
        .logo-section { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 20px; }
        .logo { max-width: 150px; height: auto; }
        .account-created { font-size: 1rem; font-weight: 600; color: #3b82f6; text-transform: uppercase; }
        .content { padding: 30px 20px; }
        .greeting { font-size: 1.3rem; font-weight: 600; color: #1e293b; margin-bottom: 15px; }
        .message { font-size: 1rem; color: #475569; margin-bottom: 25px; line-height: 1.6; }
        .cta-button { display: inline-block; background: #3b82f6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 1rem; margin: 15px 0; }
        .account-info { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0; }
        .account-info p { color: #475569; margin: 0; font-size: 0.9rem; }
        .account-info .email { color: #3b82f6; font-weight: 600; }
        .closing { margin: 20px 0; }
        .closing p { color: #475569; margin: 5px 0; }
        .footer { background-color: #f1f5f9; color: #475569; padding: 20px; text-align: center; }
        .social-links { margin-bottom: 15px; }
        .social-links a { display: inline-block; margin: 0 8px; color: #64748b; text-decoration: none; font-size: 1.1rem; }
        .footer-links { margin-bottom: 15px; }
        .footer-links a { color: #64748b; text-decoration: none; margin: 0 10px; font-size: 0.8rem; }
        .copyright { color: #94a3b8; font-size: 0.7rem; margin-top: 15px; }
        @media (max-width: 600px) {
            .content { padding: 20px 15px; }
            .header { padding: 20px 15px; }
            .logo-section { flex-direction: column; gap: 15px; }
            .logo { max-width: 120px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-section">
                <img src="{{logoUrl}}" alt="FANPURI" class="logo">
                <div class="account-created">NEW ACCOUNT CREATED</div>
            </div>
        </div>
        
        <div class="content">
            <div class="greeting">Hi {{artistName}},</div>
            
            <div class="message">
                Welcome to Fanpuri! 🎉 We're thrilled to have you join our vibrant community of fan art enthusiasts, creators, and collectors. You're now part of a world where creativity knows no bounds and every piece tells a story.
            </div>
            
            <div style="text-align: center;">
                <a href="{{submitUrl}}" class="cta-button">Start Collecting</a>
            </div>
            
            <div class="account-info">
                <p>Just in case this is helpful in the future, you have signed up as <span class="email">{{artistEmail}}</span>.</p>
            </div>
            
            <div class="closing">
                <p>Best Wishes,</p>
                <p><strong>Your friends at Fanpuri</strong></p>
            </div>
        </div>
        
        <div class="footer">
            <div class="social-links">
                <a href="https://instagram.com/fanpuri" title="Instagram">📷</a>
                <a href="https://twitter.com/fanpuri" title="Twitter">🐦</a>
                <a href="https://facebook.com/fanpuri" title="Facebook">📘</a>
                <a href="https://youtube.com/fanpuri" title="YouTube">📺</a>
                <a href="https://tiktok.com/@fanpuri" title="TikTok">🎵</a>
            </div>
            
            <div class="footer-links">
                <a href="{{helpUrl}}">Help Center</a>
                <a href="{{contactUrl}}">Contact Us</a>
                <a href="{{privacyUrl}}">Privacy Policy</a>
                <a href="{{termsUrl}}">Terms of Service</a>
            </div>
            
            <div class="copyright">
                © 2024 Fanpuri. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
`;

// Compile the artist template
const compiledArtistTemplate = handlebars.compile(artistEmailTemplate);

// Send artist welcome email
async function sendArtistWelcomeEmail(artistData) {
  try {
    const {
      name,
      email,
      username,
      creationTime
    } = artistData;

    const joinDate = new Date(creationTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const templateData = {
      artistName: name,
      artistEmail: email,
      logoUrl: 'https://via.placeholder.com/200x80/3b82f6/ffffff?text=FANPURI',
      submitUrl: process.env.FRONTEND_URL || 'https://fanpuri.com/submit',
      helpUrl: process.env.FRONTEND_URL || 'https://fanpuri.com/help',
      contactUrl: process.env.FRONTEND_URL || 'https://fanpuri.com/contact',
      privacyUrl: process.env.FRONTEND_URL || 'https://fanpuri.com/privacy',
      termsUrl: process.env.FRONTEND_URL || 'https://fanpuri.com/terms'
    };

    const htmlContent = compiledArtistTemplate(templateData);

    const mailOptions = {
      from: `"Fanpuri Team" <${emailConfig.auth.user}>`,
      to: email,
      subject: 'New Account Confirmation from Fanpuri',
      html: htmlContent,
      text: `Hi ${name},\n\nWelcome to Fanpuri as an artist! We're excited to have you join our creative community.\n\nSubmit your first work: ${templateData.submitUrl}\n\nBest wishes,\nYour friends at Fanpuri`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Updated artist welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending updated artist welcome email:', error);
    return { success: false, error: error.message };
  }
}

// Test email configuration
async function testEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ Updated email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Updated email configuration error:', error);
    return false;
  }
}

module.exports = {
  sendWelcomeEmail,
  sendArtistWelcomeEmail,
  testEmailConfig,
  transporter
}; 