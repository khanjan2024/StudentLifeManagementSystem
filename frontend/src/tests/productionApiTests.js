/**
 * Production-specific API Connection Tests
 * 
 * This file contains tests specifically for the production API environment.
 */

import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

// Production API URL
const PROD_API_URL = 'https://studentlifemanagementsystem.onrender.com';

/**
 * Test connection to the production API
 * @returns {Promise<Object>} Test results
 */
export const testProductionApiConnection = async () => {
  console.log('\n=== Production API Connection Test ===');
  console.log(`Testing connection to: ${PROD_API_URL}`);
  
  try {
    // Test direct connection to health endpoint
    const response = await axios.get(`${PROD_API_URL}/health`, {
      timeout: 10000
    });
    
    console.log('✅ Production API connection successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    return {
      success: true,
      message: 'Production API connection successful',
      data: response.data
    };
  } catch (error) {
    console.log('❌ Production API connection failed!');
    const errorInfo = handleApiError(error);
    console.error('Error details:', errorInfo);
    
    return {
      success: false,
      message: errorInfo.message,
      error: errorInfo
    };
  }
};

/**
 * Test that the API base URL is correctly set to production
 * @returns {Promise<Object>} Test results
 */
export const testProductionApiBaseUrl = async () => {
  console.log('\n=== Production API Base URL Test ===');
  
  // Import the API base URL from config
  // We need to do this dynamically to ensure it picks up the production environment
  const { API_BASE_URL } = await import('../api/config');
  
  console.log(`Configured API base URL: ${API_BASE_URL}`);
  console.log(`Expected production URL: ${PROD_API_URL}`);
  
  if (API_BASE_URL === PROD_API_URL) {
    console.log('✅ API base URL is correctly set to production!');
    return {
      success: true,
      message: 'API base URL is correctly set to production',
      url: API_BASE_URL
    };
  } else {
    console.log('❌ API base URL is not set to production!');
    return {
      success: false,
      message: 'API base URL is not set to production',
      actual: API_BASE_URL,
      expected: PROD_API_URL
    };
  }
};

/**
 * Test authentication with the production API
 * @returns {Promise<Object>} Test results
 */
export const testProductionAuthentication = async () => {
  console.log('\n=== Production API Authentication Test ===');
  
  try {
    // Try to access a protected endpoint without authentication
    await axios.get(`${PROD_API_URL}/admin/dashboard`, {
      timeout: 5000
    });
    
    console.log('❌ Test failed! Expected authentication to be required.');
    return {
      success: false,
      message: 'Authentication not required for protected endpoint'
    };
  } catch (error) {
    const errorInfo = handleApiError(error);
    
    // Check if the error is an authentication error (401)
    if (error.response && error.response.status === 401) {
      console.log('✅ Authentication required as expected!');
      return {
        success: true,
        message: 'Authentication required for protected endpoint'
      };
    } else {
      console.log('❌ Unexpected error when testing authentication!');
      console.error('Error details:', errorInfo);
      return {
        success: false,
        message: 'Unexpected error when testing authentication',
        error: errorInfo
      };
    }
  }
};

/**
 * Run all production-specific tests
 */
export const runProductionTests = async () => {
  console.log('======================================');
  console.log('RUNNING PRODUCTION API TESTS');
  console.log('======================================\n');
  
  const results = {
    productionApiConnection: await testProductionApiConnection(),
    productionApiBaseUrl: await testProductionApiBaseUrl(),
    productionAuthentication: await testProductionAuthentication()
  };
  
  console.log('\n======================================');
  console.log('PRODUCTION TEST RESULTS SUMMARY');
  console.log('======================================');
  
  let passedTests = 0;
  let totalTests = Object.keys(results).length;
  
  for (const [testName, result] of Object.entries(results)) {
    if (result.success) {
      console.log(`✅ ${testName}: PASSED`);
      passedTests++;
    } else {
      console.log(`❌ ${testName}: FAILED - ${result.message}`);
    }
  }
  
  console.log('======================================');
  console.log(`${passedTests}/${totalTests} production tests passed`);
  console.log('======================================');
  
  return {
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: totalTests - passedTests
    },
    results
  };
};

// Run the tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runProductionTests()
    .then(results => {
      console.log('Production tests completed.');
      process.exit(results.summary.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Error running production tests:', error);
      process.exit(1);
    });
}