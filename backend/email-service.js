const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

// Email configuration
const emailConfig = {
  service: 'gmail', // You can change this to other services like 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER || 'fanpuriofficial@gmail.com',
    pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD // Use App Password for Gmail
  }
};

// Create transporter
const transporter = nodemailer.createTransporter(emailConfig);

// Welcome email template
const welcomeEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Fanpuri!</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        
        .logo {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -0.02em;
        }
        
        .tagline {
            font-size: 1.1rem;
            opacity: 0.9;
            font-weight: 500;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 20px;
        }
        
        .message {
            font-size: 1.1rem;
            color: #475569;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1.1rem;
            margin: 20px 0;
            transition: transform 0.2s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .account-info {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        
        .account-info h3 {
            color: #1e293b;
            margin-bottom: 10px;
            font-size: 1.1rem;
        }
        
        .account-info p {
            color: #475569;
            margin-bottom: 5px;
        }
        
        .account-info .email {
            color: #667eea;
            font-weight: 600;
        }
        
        .features {
            margin: 40px 0;
        }
        
        .features h3 {
            color: #1e293b;
            margin-bottom: 20px;
            font-size: 1.3rem;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .feature-item {
            text-align: center;
            padding: 20px;
            background-color: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        
        .feature-icon {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        
        .feature-title {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
        }
        
        .feature-desc {
            color: #64748b;
            font-size: 0.9rem;
        }
        
        .footer {
            background-color: #1e293b;
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .social-links {
            margin-bottom: 20px;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #94a3b8;
            text-decoration: none;
            font-size: 1.2rem;
        }
        
        .social-links a:hover {
            color: #667eea;
        }
        
        .footer-links {
            margin-bottom: 20px;
        }
        
        .footer-links a {
            color: #94a3b8;
            text-decoration: none;
            margin: 0 15px;
            font-size: 0.9rem;
        }
        
        .footer-links a:hover {
            color: #667eea;
        }
        
        .copyright {
            color: #64748b;
            font-size: 0.8rem;
            margin-top: 20px;
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .feature-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">🎨 FANPURI</div>
            <div class="tagline">Where Fan Art Comes to Life</div>
        </div>
        
        <div class="content">
            <div class="greeting">Hi {{userName}},</div>
            
            <div class="message">
                Welcome to Fanpuri! 🎉 We're thrilled to have you join our vibrant community of fan art enthusiasts, creators, and collectors. You're now part of a world where creativity knows no bounds and every piece tells a story.
            </div>
            
            <div style="text-align: center;">
                <a href="{{shopUrl}}" class="cta-button">Start Exploring</a>
            </div>
            
            <div class="account-info">
                <h3>Your Account Details</h3>
                <p><strong>Email:</strong> <span class="email">{{userEmail}}</span></p>
                <p><strong>Member Since:</strong> {{joinDate}}</p>
                <p><strong>Account Status:</strong> <span style="color: #22c55e; font-weight: 600;">Active</span></p>
            </div>
            
            <div class="features">
                <h3>What You Can Do on Fanpuri</h3>
                <div class="feature-grid">
                    <div class="feature-item">
                        <div class="feature-icon">🛍️</div>
                        <div class="feature-title">Shop Fan Art</div>
                        <div class="feature-desc">Discover unique pieces from talented artists</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🎨</div>
                        <div class="feature-title">Submit Your Work</div>
                        <div class="feature-desc">Share your creativity with the community</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">⭐</div>
                        <div class="feature-title">Limited Editions</div>
                        <div class="feature-desc">Exclusive drops you won't find anywhere else</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">💝</div>
                        <div class="feature-title">Favorites</div>
                        <div class="feature-desc">Save and organize your favorite pieces</div>
                    </div>
                </div>
            </div>
            
            <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="color: #0c4a6e; margin-bottom: 10px;">🎁 Special Welcome Offer</h3>
                <p style="color: #0c4a6e; margin-bottom: 15px;">As a new member, you get <strong>10% off your first purchase</strong>! Use code: <strong style="background-color: #0ea5e9; color: white; padding: 4px 8px; border-radius: 4px;">WELCOME10</strong></p>
                <p style="color: #0c4a6e; font-size: 0.9rem;">*Valid for 30 days from registration</p>
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
                © 2024 Fanpuri. All rights reserved.<br>
                Made with ❤️ for the fan art community
            </div>
        </div>
    </div>
</body>
</html>
`;

// Compile the template
const compiledTemplate = handlebars.compile(welcomeEmailTemplate);

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
      shopUrl: process.env.FRONTEND_URL || 'https://fanpuri.com/shop',
      helpUrl: process.env.FRONTEND_URL || 'https://fanpuri.com/help',
      contactUrl: process.env.FRONTEND_URL || 'https://fanpuri.com/contact',
      privacyUrl: process.env.FRONTEND_URL || 'https://fanpuri.com/privacy',
      termsUrl: process.env.FRONTEND_URL || 'https://fanpuri.com/terms'
    };

    // Generate HTML content
    const htmlContent = compiledTemplate(templateData);

    // Email options
    const mailOptions = {
      from: `"Fanpuri Team" <${emailConfig.auth.user}>`,
      to: email,
      subject: '🎨 Welcome to Fanpuri - Your Fan Art Journey Begins!',
      html: htmlContent,
      text: `Hi ${templateData.userName},\n\nWelcome to Fanpuri! We're thrilled to have you join our vibrant community of fan art enthusiasts, creators, and collectors.\n\nStart exploring: ${templateData.shopUrl}\n\nBest wishes,\nThe Fanpuri Team`
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
}

// Send artist welcome email (for new artists)
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

    const artistEmailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Fanpuri - Artist!</title>
        <style>
            /* Same styles as welcome email */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
            .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
            .logo { font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; }
            .content { padding: 40px 30px; }
            .greeting { font-size: 1.5rem; font-weight: 600; color: #1e293b; margin-bottom: 20px; }
            .message { font-size: 1.1rem; color: #475569; margin-bottom: 30px; line-height: 1.7; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 1.1rem; margin: 20px 0; }
            .footer { background-color: #1e293b; color: white; padding: 30px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">🎨 FANPURI</div>
                <div style="font-size: 1.1rem; opacity: 0.9;">Artist Welcome</div>
            </div>
            
            <div class="content">
                <div class="greeting">Hi {{artistName}},</div>
                
                <div class="message">
                    Welcome to Fanpuri as an artist! 🎨 We're excited to have you join our creative community. Your unique vision and talent will inspire fans around the world.
                </div>
                
                <div style="text-align: center;">
                    <a href="{{submitUrl}}" class="cta-button">Submit Your First Work</a>
                </div>
                
                <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 30px 0;">
                    <h3 style="color: #0c4a6e; margin-bottom: 10px;">🎯 Next Steps</h3>
                    <ul style="color: #0c4a6e; margin-left: 20px;">
                        <li>Complete your artist profile</li>
                        <li>Upload your first artwork</li>
                        <li>Set up your payment information</li>
                        <li>Start connecting with fans</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <div style="color: #94a3b8; font-size: 0.8rem;">
                    © 2024 Fanpuri. All rights reserved.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    const compiledArtistTemplate = handlebars.compile(artistEmailTemplate);
    const templateData = {
      artistName: name,
      submitUrl: process.env.FRONTEND_URL || 'https://fanpuri.com/submit'
    };

    const htmlContent = compiledArtistTemplate(templateData);

    const mailOptions = {
      from: `"Fanpuri Team" <${emailConfig.auth.user}>`,
      to: email,
      subject: '🎨 Welcome to Fanpuri - Artist Account Created!',
      html: htmlContent,
      text: `Hi ${name},\n\nWelcome to Fanpuri as an artist! We're excited to have you join our creative community.\n\nSubmit your first work: ${templateData.submitUrl}\n\nBest wishes,\nThe Fanpuri Team`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Artist welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending artist welcome email:', error);
    return { success: false, error: error.message };
  }
}

// Test email configuration
async function testEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return false;
  }
}

module.exports = {
  sendWelcomeEmail,
  sendArtistWelcomeEmail,
  testEmailConfig,
  transporter
}; 