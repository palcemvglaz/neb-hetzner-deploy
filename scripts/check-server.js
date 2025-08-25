#!/usr/bin/env node

/**
 * Quick server status check
 * Returns proper exit code for shell scripting
 */

const { exec } = require('child_process');

const PORT = process.argv[2] || '3205';

exec(`lsof -ti:${PORT}`, (error, stdout) => {
  if (error || !stdout.trim()) {
    console.log(`❌ Server NOT running on port ${PORT}`);
    console.log(`\n🚀 To start the server, run:`);
    console.log(`   ./start.sh`);
    console.log(`   or`);
    console.log(`   npm run dev`);
    process.exit(1);
  } else {
    console.log(`✅ Server is running on port ${PORT} (PID: ${stdout.trim()})`);
    process.exit(0);
  }
});