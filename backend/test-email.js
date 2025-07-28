const { testEmailConfig, sendWelcomeEmail } = require('./email-service');

async function testEmail() {
  console.log('🧪 Testing email configuration...');
  
  try {
    // Test email configuration
    const isConfigValid = await testEmailConfig();
    
    if (isConfigValid) {
      console.log('✅ Email configuration is valid!');
      
      // Test sending a welcome email
      console.log('📧 Testing welcome email...');
      
      const testUserData = {
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
        uid: 'test-uid-123',
        creationTime: new Date().toISOString()
      };
      
      const emailResult = await sendWelcomeEmail(testUserData);
      
      if (emailResult.success) {
        console.log('✅ Welcome email sent successfully!');
        console.log('Message ID:', emailResult.messageId);
      } else {
        console.log('❌ Failed to send welcome email:', emailResult.error);
      }
      
    } else {
      console.log('❌ Email configuration is invalid!');
      console.log('Please check your .env file and Gmail App Password.');
    }
    
  } catch (error) {
    console.error('❌ Error testing email:', error.message);
  }
}

// Run the test
testEmail(); 