/**
 * Development Environment API Connection Test Runner
 * 
 * This script runs API connection tests in the development environment.
 */

// Set environment to development
process.env.NODE_ENV = 'development';

// Import the test runner
const { runAllTests } = require('./apiConnectionTest');

console.log('Running API connection tests in DEVELOPMENT environment...');

// Run the tests
runAllTests()
  .then(results => {
    console.log('Development environment tests completed.');
    
    // Exit with appropriate code
    if (results.summary.failed > 0) {
      console.log(`${results.summary.failed} tests failed. Check the logs for details.`);
      process.exit(1);
    } else {
      console.log('All tests passed successfully!');
      process.exit(0);
    }
  })
  .catch(error => {
    console.error('Error running development tests:', error);
    process.exit(1);
  });