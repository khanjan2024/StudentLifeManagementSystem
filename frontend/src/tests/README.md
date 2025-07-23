# API Connection Tests

This directory contains tests for verifying API connections in different environments and testing error handling for various connection scenarios.

## Test Files

- `apiConnectionTest.js` - Core test functions for API connection testing
- `runDevTests.js` - Script to run tests in the development environment
- `runProdTests.js` - Script to run tests in the production environment

## Running the Tests

### Prerequisites

- Make sure the backend server is running for development tests
- For production tests, ensure you have internet access to reach the production API

### Development Environment Tests

To test API connections in the development environment:

```bash
# From the frontend directory
node src/tests/runDevTests.js
```

This will test connections to your local backend server (http://localhost:5000).

### Production Environment Tests

To test API connections in the production environment:

```bash
# From the frontend directory
node src/tests/runProdTests.js
```

This will test connections to the production backend server.

## Test Cases

The tests verify the following:

1. **API Connection** - Tests direct connection to the health endpoint
2. **API Availability** - Tests the API availability check function
3. **Connection Refused** - Tests error handling for connection refused scenarios
4. **Retry Mechanism** - Tests the retry mechanism for failed API calls
5. **Timeout Handling** - Tests handling of request timeouts

## Troubleshooting

If tests fail, check the following:

- For development tests:
  - Is the backend server running on port 5000?
  - Are there any CORS issues preventing connections?
  - Is the health endpoint implemented and accessible?

- For production tests:
  - Do you have internet access?
  - Is the production API server running?
  - Are there any network restrictions blocking the connection?

## Adding New Tests

To add new test cases:

1. Add your test function to `apiConnectionTest.js`
2. Update the `runAllTests` function to include your new test
3. Run the tests to verify your changes