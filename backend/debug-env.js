require('dotenv').config();

console.log('🔍 Debugging environment variables...');
console.log('');

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET');
console.log('EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? '***SET***' : 'NOT SET');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('');

if (!process.env.EMAIL_PASSWORD) {
  console.log('❌ EMAIL_PASSWORD is not set in your .env file');
  console.log('Please add your Gmail App Password to the .env file');
} else {
  console.log('✅ EMAIL_PASSWORD is set');
}

if (!process.env.EMAIL_USER) {
  console.log('❌ EMAIL_USER is not set');
} else {
  console.log('✅ EMAIL_USER is set to:', process.env.EMAIL_USER);
}

console.log('');
console.log('📝 Make sure your .env file contains:');
console.log('EMAIL_USER=fanpuriofficial@gmail.com');
console.log('EMAIL_PASSWORD=YOUR_16_CHARACTER_APP_PASSWORD');
console.log('EMAIL_APP_PASSWORD=YOUR_16_CHARACTER_APP_PASSWORD'); 