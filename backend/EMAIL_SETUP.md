# 📧 Email Setup Guide for Fanpuri

This guide will help you set up the welcome email system for new user registrations in Fanpuri.

## 🎯 Features

- **Welcome Emails**: Beautiful, professional welcome emails sent to new users
- **Artist Welcome Emails**: Special welcome emails for new artists
- **Responsive Design**: Emails look great on all devices
- **Custom Templates**: Branded with Fanpuri's design and colors
- **Error Handling**: Graceful fallback if email sending fails

## 📋 Prerequisites

1. **Gmail Account**: You'll need a Gmail account to send emails
2. **App Password**: Gmail requires an App Password for security
3. **Environment Variables**: Configure email settings in your `.env` file

## 🔧 Setup Instructions

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account settings
2. Navigate to "Security"
3. Enable "2-Step Verification"

### Step 2: Generate App Password

1. Go to your Google Account settings
2. Navigate to "Security" → "2-Step Verification"
3. Click "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Enter "Fanpuri Email Service" as the name
6. Copy the generated 16-character password

### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Update the email configuration in `.env`:
   ```env
   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   EMAIL_APP_PASSWORD=your-gmail-app-password
   
   # Frontend URL (for email links)
   FRONTEND_URL=http://localhost:3000
   ```

### Step 4: Test Email Configuration

1. Start your server:
   ```bash
   npm run dev
   ```

2. Test the email configuration:
   ```bash
   curl http://localhost:5000/api/test-email
   ```

3. You should see:
   ```json
   {
     "message": "Email configuration is valid",
     "status": "success"
   }
   ```

## 🎨 Email Templates

### Welcome Email Features

- **Professional Design**: Clean, modern layout with Fanpuri branding
- **Personalized Content**: Uses user's name and email
- **Call-to-Action**: "Start Exploring" button linking to the shop
- **Feature Highlights**: Showcases key platform features
- **Welcome Offer**: 10% discount code for new users
- **Social Links**: Links to Fanpuri's social media
- **Responsive**: Works perfectly on mobile and desktop

### Artist Welcome Email Features

- **Artist-Specific Content**: Tailored for new artists
- **Next Steps Guide**: Clear instructions for getting started
- **Submit Work Button**: Direct link to submit first artwork
- **Professional Onboarding**: Helps artists understand the platform

## 🔄 How It Works

### User Registration Flow

1. **User Signs Up**: User clicks "Sign in with Google" on the frontend
2. **Firebase Auth**: Firebase handles authentication
3. **New User Detection**: Frontend detects if this is a new user
4. **Backend Registration**: Frontend calls `/api/auth/register` endpoint
5. **User Storage**: User data is stored in Firestore
6. **Welcome Email**: Beautiful welcome email is sent automatically
7. **Success Response**: User sees success message

### Email Sending Process

1. **Template Compilation**: Handlebars compiles the email template
2. **Data Population**: User data is inserted into the template
3. **Email Generation**: HTML and text versions are created
4. **SMTP Sending**: Nodemailer sends via Gmail SMTP
5. **Error Handling**: Graceful fallback if email fails

## 🛠️ Customization

### Modifying Email Templates

Edit the templates in `email-service.js`:

```javascript
// Welcome email template
const welcomeEmailTemplate = `
  <!DOCTYPE html>
  <html>
    <!-- Your custom HTML here -->
  </html>
`;
```

### Adding New Email Types

1. Create a new template function:
   ```javascript
   async function sendCustomEmail(userData) {
     // Your email logic here
   }
   ```

2. Export it from `email-service.js`:
   ```javascript
   module.exports = {
     sendWelcomeEmail,
     sendArtistWelcomeEmail,
     sendCustomEmail, // Add your new function
     testEmailConfig
   };
   ```

3. Use it in your endpoints:
   ```javascript
   await sendCustomEmail(userData);
   ```

## 🔍 Troubleshooting

### Common Issues

#### "Invalid login" Error
- **Cause**: Incorrect email or password
- **Solution**: Double-check your Gmail credentials and App Password

#### "Less secure app access" Error
- **Cause**: Gmail blocking less secure apps
- **Solution**: Use App Password instead of regular password

#### Emails Not Sending
- **Cause**: Network issues or Gmail restrictions
- **Solution**: Check server logs and Gmail settings

#### Template Not Rendering
- **Cause**: Handlebars syntax error
- **Solution**: Check template syntax and variable names

### Debug Commands

```bash
# Test email configuration
curl http://localhost:5000/api/test-email

# Check server logs
npm run dev

# Test with sample data
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "displayName": "Test User",
    "uid": "test-uid-123"
  }'
```

## 📊 Monitoring

### Log Messages

- `✅ Welcome email sent to: user@example.com` - Success
- `⚠️ Email sending failed, but user registration succeeded` - Email failed but user created
- `❌ Error sending welcome email: error message` - Complete failure

### Email Delivery

- Check Gmail's "Sent" folder for sent emails
- Monitor spam folders for delivery issues
- Use email tracking services for detailed analytics

## 🔒 Security Considerations

1. **App Passwords**: Use Gmail App Passwords, not regular passwords
2. **Environment Variables**: Never commit `.env` files to version control
3. **Rate Limiting**: Consider implementing rate limiting for email endpoints
4. **Email Validation**: Validate email addresses before sending
5. **Error Handling**: Don't expose sensitive information in error messages

## 🚀 Production Deployment

### Environment Variables for Production

```env
EMAIL_USER=fanpuriofficial@gmail.com
EMAIL_PASSWORD=your-production-app-password
EMAIL_APP_PASSWORD=your-production-app-password
FRONTEND_URL=https://fanpuri.com
```

### Email Service Providers

For production, consider using dedicated email services:

- **SendGrid**: Professional email delivery service
- **Mailgun**: Developer-friendly email API
- **Amazon SES**: Cost-effective email service
- **Postmark**: Transactional email service

### Updating Email Service

To switch to a different email provider:

1. Update the `emailConfig` in `email-service.js`
2. Modify the transporter configuration
3. Test thoroughly before deploying

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review server logs for error messages
3. Test email configuration with the provided endpoints
4. Verify Gmail settings and App Password
5. Contact the development team for assistance

---

**Happy emailing! 🎉** 