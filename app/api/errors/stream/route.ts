import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

// Server-Sent Events for real-time error streaming
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  // Create a stream
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', message: 'Error monitoring active' })}\n\n`)
      );

      // Watch log files
      const logFiles = [
        'logs/error.log',
        'logs/browser.log',
        'nextjs.log'
      ];

      const watchers: fs.FSWatcher[] = [];

      logFiles.forEach(logFile => {
        const fullPath = path.join(process.cwd(), logFile);
        
        if (fs.existsSync(fullPath)) {
          let lastSize = fs.statSync(fullPath).size;
          
          const watcher = fs.watch(fullPath, (eventType) => {
            if (eventType === 'change') {
              const currentSize = fs.statSync(fullPath).size;
              
              if (currentSize > lastSize) {
                // Read new content
                const stream = fs.createReadStream(fullPath, {
                  start: lastSize,
                  end: currentSize
                });

                let buffer = '';
                stream.on('data', (chunk) => {
                  buffer += chunk.toString();
                });

                stream.on('end', () => {
                  const lines = buffer.split('\n').filter(line => line.trim());
                  
                  lines.forEach(line => {
                    if (line.includes('ERROR') || line.includes('Browser Error')) {
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({
                          type: 'error',
                          source: logFile,
                          message: line,
                          timestamp: new Date().toISOString()
                        })}\n\n`)
                      );
                    }
                  });
                  
                  lastSize = currentSize;
                });
              }
            }
          });
          
          watchers.push(watcher);
        }
      });

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        watchers.forEach(watcher => watcher.close());
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}