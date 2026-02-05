// Simple script to grant admin access on production
// Run this with: node setup-admin.js

import https from 'https';

const data = JSON.stringify({
  secretKey: 'your-secret-key-2024',
  email: 'd.skeats@googlemail.com'
});

const options = {
  hostname: 'www.partnerconnector.co.uk',
  port: 443,
  path: '/api/admin/initialize-production-admin',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('\n✅ Response from server:');
    console.log(JSON.parse(responseData));
    console.log('\n🎉 If successful, you can now access the admin portal at:');
    console.log('https://www.partnerconnector.co.uk/admin');
    console.log('\nMake sure you logged in first at https://www.partnerconnector.co.uk/login');
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error);
});

console.log('🔑 Granting admin access to d.skeats@googlemail.com...');
req.write(data);
req.end();