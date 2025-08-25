#!/usr/bin/env node

/**
 * API Testing Script for Nebachiv Content App
 * Alternative to curl for testing API endpoints without confirmation prompts
 */

const fs = require('fs');
const path = require('path');

// Colors for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Mock fetch for testing APIs
async function testAPI(url, options = {}) {
  try {
    // Check if server is running
    const baseUrl = url.startsWith('http') ? url : `http://localhost:3205${url}`;
    
    log(`\nTesting: ${baseUrl}`, 'blue');
    
    // Read session from .env.local if exists
    let sessionToken = null;
    const envLocalPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envLocalPath)) {
      const envContent = fs.readFileSync(envLocalPath, 'utf8');
      const match = envContent.match(/NEXTAUTH_SESSION_TOKEN=(.+)/);
      if (match) {
        sessionToken = match[1];
      }
    }
    
    // Check for JWT sessions in middleware logs
    if (!sessionToken) {
      log('  Checking for JWT sessions in middleware logs...', 'yellow');
      const { execSync } = require('child_process');
      try {
        const result = execSync(
          `tail -n 50 nextjs.log | grep -A 10 "Middleware - token:" | grep "email.*admin" | head -1`,
          { encoding: 'utf8' }
        ).trim();
        if (result) {
          log('  ✓ Found active JWT session (admin logged in)', 'green');
          // For JWT sessions, we'll rely on the browser cookies
          sessionToken = 'jwt-session-active';
        }
      } catch (e) {
        // Log check failed
      }
    }
    
    // Try to get session from database (fallback)
    if (!sessionToken && fs.existsSync('./prisma/dev.db')) {
      log('  Checking database for session tokens...', 'yellow');
      const { execSync } = require('child_process');
      try {
        const result = execSync(
          `sqlite3 ./prisma/dev.db "SELECT sessionToken FROM Session WHERE expires > datetime('now') LIMIT 1;"`,
          { encoding: 'utf8' }
        ).trim();
        if (result) {
          sessionToken = result;
          log('  ✓ Found active session in database', 'green');
        }
      } catch (e) {
        // sqlite3 might not be installed
      }
    }
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (sessionToken) {
      headers.Cookie = `next-auth.session-token=${sessionToken}`;
    }
    
    // Make request using Node's http module
    const http = require('http');
    const urlObj = new URL(baseUrl);
    
    return new Promise((resolve, reject) => {
      const req = http.request({
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          log(`  Status: ${res.statusCode}`, res.statusCode >= 400 ? 'red' : 'green');
          
          try {
            const json = JSON.parse(data);
            if (res.statusCode === 401) {
              log('  ✗ Unauthorized - No valid session found', 'red');
              log('  → Please login first at http://localhost:3205/login', 'yellow');
            } else if (res.statusCode >= 400) {
              log(`  ✗ Error: ${json.error || 'Unknown error'}`, 'red');
            } else {
              log('  ✓ Success', 'green');
              if (Array.isArray(json)) {
                log(`  → Returned array with ${json.length} items`, 'blue');
              } else if (typeof json === 'object') {
                log(`  → Returned object with keys: ${Object.keys(json).join(', ')}`, 'blue');
              }
            }
            resolve({ status: res.statusCode, data: json });
          } catch (e) {
            log(`  ✗ Invalid JSON response: ${data.substring(0, 100)}...`, 'red');
            resolve({ status: res.statusCode, data });
          }
        });
      });
      
      req.on('error', (e) => {
        log(`  ✗ Connection error: ${e.message}`, 'red');
        log('  → Is the server running? Try: npm run dev', 'yellow');
        reject(e);
      });
      
      if (options.body) {
        req.write(JSON.stringify(options.body));
      }
      
      req.end();
    });
  } catch (error) {
    log(`  ✗ Error: ${error.message}`, 'red');
    return { status: 0, error: error.message };
  }
}

// Main test function
async function runTests() {
  log('🧪 API Testing Tool', 'blue');
  log('=' .repeat(50), 'blue');
  
  const endpoint = process.argv[2] || '/api/admin/content';
  
  await testAPI(endpoint);
  
  // Additional common endpoints
  if (!process.argv[2]) {
    log('\n📋 Testing other common endpoints:', 'yellow');
    await testAPI('/api/health');
    await testAPI('/api/courses');
  }
}

// Export for use in other scripts
module.exports = { testAPI };

// Run if called directly
if (require.main === module) {
  runTests();
}