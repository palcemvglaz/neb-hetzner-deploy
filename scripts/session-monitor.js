#!/usr/bin/env node

/**
 * Session and Activity Monitor
 * Shows real-time user activity from middleware logs
 */

const { spawn } = require('child_process');

console.log('🔍 Session Monitor - Watching user activity...\n');

function formatTime() {
  return new Date().toLocaleTimeString();
}

function parseMiddlewareLog(line) {
  if (line.includes('Middleware - path:')) {
    const pathMatch = line.match(/Middleware - path: (.+)/);
    if (pathMatch) {
      return { type: 'path', path: pathMatch[1] };
    }
  }
  
  if (line.includes('Middleware - token:') && line.includes('email')) {
    const emailMatch = line.match(/email: '([^']+)'/);
    const roleMatch = line.match(/role: '([^']+)'/);
    if (emailMatch) {
      return { 
        type: 'auth', 
        email: emailMatch[1], 
        role: roleMatch ? roleMatch[1] : 'unknown' 
      };
    }
  }
  
  if (line.includes('GET ') || line.includes('POST ')) {
    const requestMatch = line.match(/(GET|POST) (.+?) (\d+) in (\d+)ms/);
    if (requestMatch) {
      return {
        type: 'request',
        method: requestMatch[1],
        path: requestMatch[2],
        status: requestMatch[3],
        time: requestMatch[4] + 'ms'
      };
    }
  }
  
  return null;
}

// Monitor logs in real-time
const tail = spawn('tail', ['-f', 'nextjs.log']);

let currentUser = null;
let lastPath = null;

tail.stdout.on('data', (data) => {
  const lines = data.toString().split('\n');
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const parsed = parseMiddlewareLog(line);
    if (!parsed) continue;
    
    switch (parsed.type) {
      case 'auth':
        if (parsed.email !== currentUser) {
          currentUser = parsed.email;
          console.log(`\n🔐 [${formatTime()}] User logged in: ${parsed.email} (${parsed.role})`);
        }
        break;
        
      case 'path':
        if (parsed.path !== lastPath && currentUser) {
          lastPath = parsed.path;
          console.log(`📍 [${formatTime()}] ${currentUser} navigated to: ${parsed.path}`);
        }
        break;
        
      case 'request':
        if (parsed.path.startsWith('/api/') && currentUser) {
          const icon = parsed.status.startsWith('2') ? '✅' : '❌';
          console.log(`${icon} [${formatTime()}] API ${parsed.method} ${parsed.path} → ${parsed.status} (${parsed.time})`);
        }
        break;
    }
  }
});

tail.stderr.on('data', (data) => {
  console.error(`Error: ${data}`);
});

tail.on('close', (code) => {
  console.log(`\nSession monitor stopped (${code})`);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n👋 Stopping session monitor...');
  tail.kill();
  process.exit(0);
});

console.log('💡 Navigate to any admin page to see activity...\n');