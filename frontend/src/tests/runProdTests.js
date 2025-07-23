/**
 * Production Environment API Connection Test Runner
 * 
 * This script runs API connection tests in the production environment.
 */

// Set environment to production
process.env.NODE_ENV = 'production';

// Import the test runners
const { runAllTests } = require('./apiConnectionTest');
const { runProductionTests } = require('./productionApiTests');

console.log('Running API connection tests in PRODUCTION environment...');

// Run both general and production-specific tests
Promise.all([
  runAllTests(),
  runProductionTests()
])
  .then(([generalResults, productionResults]) => {
    console.log('Production environment tests completed.');
    
    // Combine results
    const totalTests = generalResults.summary.total + productionResults.summary.total;
    const failedTests = generalResults.summary.failed + productionResults.summary.failed;
    
    console.log('\n======================================');
    console.log('OVERALL TEST RESULTS');
    console.log('======================================');
    console.log(`General Tests: ${generalResults.summary.passed}/${generalResults.summary.total} passed`);
    console.log(`Production Tests: ${productionResults.summary.passed}/${productionResults.summary.total} passed`);
    console.log(`Total: ${totalTests - failedTests}/${totalTests} passed`);
    console.log('======================================');
    
    // Exit with appropriate code
    if (failedTests > 0) {
      console.log(`${failedTests} tests failed. Check the logs for details.`);
      process.exit(1);
    } else {
      console.log('All tests passed successfully!');
      process.exit(0);
    }
  })
  .catch(error => {
    console.error('Error running production tests:', error);
    process.exit(1);
  });