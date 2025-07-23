/**
 * Production API Verification Script
 * 
 * This script verifies that the production API is available and functioning correctly.
 * It can be used as a pre-deployment check to ensure the backend is ready.
 */

const axios = require('axios');

// Production API URL
const PROD_API_URL = 'https://studentlifemanagementsystem.onrender.com';

/**
 * Verify the production API health
 */
async function verifyProductionApi() {
  console.log('======================================');
  console.log('PRODUCTION API VERIFICATION');
  console.log(`URL: ${PROD_API_URL}`);
  console.log('======================================\n');
  
  try {
    console.log('Checking API health...');
    const response = await axios.get(`${PROD_API_URL}/health`, {
      timeout: 10000
    });
    
    console.log('✅ Production API is available!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Check database connection
    if (response.data.database && response.data.database.status === 'connected') {
      console.log('✅ Database is connected!');
    } else {
      console.log('❌ Database is not connected!');
      console.log('Database status:', response.data.database);
    }
    
    // Check overall status
    if (response.data.status === 'ok') {
      console.log('✅ Overall API status is OK!');
    } else {
      console.log(`❌ API status is ${response.data.status}!`);
    }
    
    console.log('\n======================================');
    
    // Return success if API is available and status is OK
    return response.data.status === 'ok';
  } catch (error) {
    console.log('❌ Production API verification failed!');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
      console.error('Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    
    console.log('\n======================================');
    return false;
  }
}

// Run the verification if this script is executed directly
if (require.main === module) {
  verifyProductionApi()
    .then(success => {
      if (success) {
        console.log('Production API verification successful!');
        process.exit(0);
      } else {
        console.error('Production API verification failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Error during verification:', error);
      process.exit(1);
    });
}

module.exports = {
  verifyProductionApi
};