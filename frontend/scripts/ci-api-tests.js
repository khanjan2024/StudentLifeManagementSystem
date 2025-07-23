/**
 * CI/CD API Connection Test Script
 * 
 * This script runs API connection tests in a CI/CD environment.
 * It can be used in deployment pipelines to verify API connections.
 */

const { spawn } = require('child_process');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const env = args[0] || 'prod'; // Default to prod in CI/CD
const skipOnFailure = args.includes('--skip-on-failure');

console.log(`Running API connection tests in ${env.toUpperCase()} environment...`);
console.log(`Skip on failure: ${skipOnFailure ? 'Yes' : 'No'}`);

// Determine which test script to run
let testScript;
switch (env.toLowerCase()) {
  case 'dev':
  case 'development':
    testScript = '../src/tests/runDevTests.js';
    break;
  case 'prod':
  case 'production':
  default:
    testScript = '../src/tests/runProdTests.js';
    break;
}

// Get the absolute path to the test script
const scriptPath = path.resolve(__dirname, testScript);

// Run the test script
const testProcess = spawn('node', [scriptPath], { stdio: 'inherit' });

testProcess.on('close', (code) => {
  if (code === 0) {
    console.log('API connection tests passed successfully!');
    process.exit(0);
  } else {
    console.error(`API connection tests failed with exit code ${code}`);
    
    if (skipOnFailure) {
      console.log('Continuing despite test failures (--skip-on-failure flag is set)');
      process.exit(0);
    } else {
      process.exit(code);
    }
  }
});