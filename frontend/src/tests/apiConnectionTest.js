/**
 * API Connection Test Script
 * 
 * This script tests API connections in different environments and verifies
 * error handling for various connection scenarios.
 */

import axios from 'axios';
import apiClient from '../api/apiClient';
import { API_BASE_URL, checkApiAvailability } from '../api/config';
import { handleApiError, isConnectionError } from '../utils/errorHandler';
import { retryApiCall } from '../utils/apiRetry';

/**
 * Test API connection to the health endpoint
 * @returns {Promise<Object>} Test results
 */
const testApiConnection = async () => {
  console.log('=== API Connection Test ===');
  console.log(`Testing connection to: ${API_BASE_URL}`);
  
  try {
    // Test direct connection to health endpoint
    console.log('\n1. Testing direct connection to health endpoint...');
    const response = await apiClient.get('/health');
    console.log('✅ Connection successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    return {
      success: true,
      message: 'API connection successful',
      data: response.data
    };
  } catch (error) {
    console.log('❌ Connection failed!');
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
 * Test API availability check function
 * @returns {Promise<Object>} Test results
 */
const testApiAvailability = async () => {
  console.log('\n2. Testing API availability check function...');
  
  try {
    const isAvailable = await checkApiAvailability();
    console.log(isAvailable ? '✅ API is available!' : '❌ API is not available!');
    
    return {
      success: true,
      available: isAvailable
    };
  } catch (error) {
    console.log('❌ API availability check failed!');
    console.error('Error:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Test error handling for connection refused scenario
 * @returns {Promise<Object>} Test results
 */
const testConnectionRefused = async () => {
  console.log('\n3. Testing error handling for connection refused...');
  
  // Create a client that points to a non-existent server
  const badClient = axios.create({
    baseURL: 'http://localhost:9999', // Assuming no server runs on this port
    timeout: 2000
  });
  
  try {
    await badClient.get('/');
    console.log('❌ Test failed! Expected connection to fail but it succeeded.');
    
    return {
      success: false,
      message: 'Expected connection to fail but it succeeded'
    };
  } catch (error) {
    const errorInfo = handleApiError(error);
    const isConnError = isConnectionError(error);
    
    console.log('✅ Connection refused error caught as expected!');
    console.log('Is connection error:', isConnError);
    console.log('Error message:', errorInfo.message);
    
    if (isConnError && errorInfo.code === 'CONNECTION_REFUSED') {
      console.log('✅ Error correctly identified as connection refused!');
      return {
        success: true,
        message: 'Connection refused error handled correctly'
      };
    } else {
      console.log('❌ Error not correctly identified as connection refused.');
      return {
        success: false,
        message: 'Error not correctly identified as connection refused',
        error: errorInfo
      };
    }
  }
};

/**
 * Test retry mechanism for failed API calls
 * @returns {Promise<Object>} Test results
 */
const testRetryMechanism = async () => {
  console.log('\n4. Testing retry mechanism for failed API calls...');
  
  // Create a client that points to a non-existent server
  const badClient = axios.create({
    baseURL: 'http://localhost:9999', // Assuming no server runs on this port
    timeout: 1000
  });
  
  let attemptCount = 0;
  
  try {
    await retryApiCall(async () => {
      attemptCount++;
      console.log(`Attempt ${attemptCount}...`);
      return await badClient.get('/');
    }, {
      maxRetries: 2,
      initialDelayMs: 500,
      factor: 2
    });
    
    console.log('❌ Test failed! Expected all retries to fail.');
    
    return {
      success: false,
      message: 'Expected all retries to fail but request succeeded'
    };
  } catch (error) {
    console.log(`✅ All ${attemptCount} retry attempts failed as expected!`);
    
    if (attemptCount === 3) { // Initial attempt + 2 retries
      console.log('✅ Retry mechanism worked correctly!');
      return {
        success: true,
        message: 'Retry mechanism worked correctly',
        attempts: attemptCount
      };
    } else {
      console.log('❌ Retry mechanism did not make the expected number of attempts.');
      return {
        success: false,
        message: 'Retry mechanism did not make the expected number of attempts',
        attempts: attemptCount
      };
    }
  }
};

/**
 * Test timeout handling
 * @returns {Promise<Object>} Test results
 */
const testTimeoutHandling = async () => {
  console.log('\n5. Testing timeout handling...');
  
  // Create a client with a very short timeout
  const timeoutClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 1 // 1ms timeout (will almost certainly timeout)
  });
  
  try {
    await timeoutClient.get('/health');
    console.log('❌ Test failed! Expected request to timeout but it succeeded.');
    
    return {
      success: false,
      message: 'Expected request to timeout but it succeeded'
    };
  } catch (error) {
    const errorInfo = handleApiError(error);
    
    console.log('✅ Timeout error caught!');
    console.log('Error message:', errorInfo.message);
    
    if (error.code === 'ECONNABORTED' || errorInfo.message.includes('timeout')) {
      console.log('✅ Error correctly identified as timeout!');
      return {
        success: true,
        message: 'Timeout error handled correctly'
      };
    } else {
      console.log('❌ Error not correctly identified as timeout.');
      return {
        success: false,
        message: 'Error not correctly identified as timeout',
        error: errorInfo
      };
    }
  }
};

/**
 * Run all tests
 */
const runAllTests = async () => {
  console.log('======================================');
  console.log('RUNNING API CONNECTION TESTS');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('API Base URL:', API_BASE_URL);
  console.log('======================================\n');
  
  const results = {
    apiConnection: await testApiConnection(),
    apiAvailability: await testApiAvailability(),
    connectionRefused: await testConnectionRefused(),
    retryMechanism: await testRetryMechanism(),
    timeoutHandling: await testTimeoutHandling()
  };
  
  console.log('\n======================================');
  console.log('TEST RESULTS SUMMARY');
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
  console.log(`${passedTests}/${totalTests} tests passed`);
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
  runAllTests()
    .then(results => {
      console.log('Tests completed.');
      process.exit(results.summary.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Error running tests:', error);
      process.exit(1);
    });
}

// Export the test functions for use in other scripts
export {
  testApiConnection,
  testApiAvailability,
  testConnectionRefused,
  testRetryMechanism,
  testTimeoutHandling,
  runAllTests
};