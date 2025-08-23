/**
 * Enhanced Logging System for Nebachiv Content App
 * Inspired by my-finance-app logging patterns
 * 
 * Features:
 * - Structured logging with context
 * - API request/response tracking
 * - Error categorization and reporting
 * - KB_NEB operation monitoring
 * - Performance metrics
 */

import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Log levels
export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

// Context interfaces
interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

interface ApiContext extends LogContext {
  method?: string;
  url?: string;
  statusCode?: number;
  duration?: number;
  userAgent?: string;
  ip?: string;
}

interface KbNebContext extends LogContext {
  operation?: 'sync' | 'import' | 'generate' | 'validate';
  contentType?: 'course' | 'test' | 'article' | 'principle';
  itemCount?: number;
  source?: string;
}

interface ErrorContext extends LogContext {
  stack?: string;
  errorCode?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

// Log entry structure
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  environment: string;
}

class EnhancedLogger {
  private logDir: string;
  private environment: string;

  constructor() {
    this.logDir = join(process.cwd(), 'logs');
    this.environment = process.env.NODE_ENV || 'development';
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    if (!existsSync(this.logDir)) {
      mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatLog(entry: LogEntry): string {
    return JSON.stringify({
      ...entry,
      timestamp: new Date().toISOString(),
      environment: this.environment
    }) + '\n';
  }

  private writeToFile(filename: string, content: string): void {
    try {
      const filePath = join(this.logDir, filename);
      appendFileSync(filePath, content);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      environment: this.environment
    };

    const formattedLog = this.formatLog(entry);

    // Write to appropriate log files
    this.writeToFile('combined.log', formattedLog);
    
    if (level === LogLevel.ERROR) {
      this.writeToFile('error.log', formattedLog);
    }

    // Console output in development
    if (this.environment === 'development') {
      const emoji = {
        [LogLevel.ERROR]: '🔴',
        [LogLevel.WARN]: '🟡',
        [LogLevel.INFO]: '🔵',
        [LogLevel.DEBUG]: '🟣'
      }[level];

      console.log(`${emoji} [${level}] ${message}`, context ? context : '');
    }
  }

  // Standard logging methods
  error(message: string, context?: ErrorContext): void {
    this.log(LogLevel.ERROR, message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  // Specialized logging methods
  logApiRequest(req: any, res: any, duration: number): void {
    const context: ApiContext = {
      component: 'API',
      action: 'request',
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id
    };

    const message = `${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`;
    
    if (res.statusCode >= 400) {
      this.error(message, context);
    } else {
      this.info(message, context);
    }

    // Write to dedicated API log
    this.writeToFile('api.log', this.formatLog({
      timestamp: new Date().toISOString(),
      level: res.statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO,
      message,
      context,
      environment: this.environment
    }));
  }

  logApiError(req: any, error: Error, statusCode: number = 500): void {
    const context: ErrorContext = {
      component: 'API',
      action: 'error',
      method: req.method,
      url: req.url,
      statusCode,
      stack: error.stack,
      severity: statusCode >= 500 ? 'critical' : 'medium',
      userId: req.user?.id
    };

    this.error(`API Error: ${error.message}`, context);
  }

  logKbNebOperation(operation: string, result: any, context?: KbNebContext): void {
    const fullContext: KbNebContext = {
      component: 'KB_NEB',
      action: 'operation',
      operation: operation as any,
      ...context,
      ...result
    };

    const message = `KB_NEB ${operation}: ${result.success ? 'Success' : 'Failed'}`;
    
    if (result.success) {
      this.info(message, fullContext);
    } else {
      this.error(message, { ...fullContext, severity: 'high' });
    }

    // Write to dedicated KB_NEB log
    this.writeToFile('kb-neb.log', this.formatLog({
      timestamp: new Date().toISOString(),
      level: result.success ? LogLevel.INFO : LogLevel.ERROR,
      message,
      context: fullContext,
      environment: this.environment
    }));
  }

  logUserAction(action: string, userId: string, context?: LogContext): void {
    const fullContext: LogContext = {
      component: 'USER_ACTION',
      action,
      userId,
      ...context
    };

    this.info(`User Action: ${action}`, fullContext);

    // Write to dedicated user action log
    this.writeToFile('user-actions.log', this.formatLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message: `User Action: ${action}`,
      context: fullContext,
      environment: this.environment
    }));
  }

  logPerformance(operation: string, duration: number, context?: LogContext): void {
    const fullContext: LogContext = {
      component: 'PERFORMANCE',
      action: 'timing',
      ...context,
      duration
    };

    const message = `Performance: ${operation} completed in ${duration}ms`;
    
    // Log as warning if operation takes too long
    if (duration > 5000) {
      this.warn(message, { ...fullContext, severity: 'medium' });
    } else {
      this.info(message, fullContext);
    }

    // Write to dedicated performance log
    this.writeToFile('performance.log', this.formatLog({
      timestamp: new Date().toISOString(),
      level: duration > 5000 ? LogLevel.WARN : LogLevel.INFO,
      message,
      context: fullContext,
      environment: this.environment
    }));
  }

  logCourseOperation(operation: string, courseId: string, userId: string, context?: LogContext): void {
    const fullContext: LogContext = {
      component: 'COURSE',
      action: operation,
      userId,
      ...context,
      courseId
    };

    this.info(`Course ${operation}: ${courseId}`, fullContext);
  }

  logPaymentOperation(operation: string, amount: number, userId: string, context?: LogContext): void {
    const fullContext: LogContext = {
      component: 'PAYMENT',
      action: operation,
      userId,
      ...context,
      amount
    };

    this.info(`Payment ${operation}: $${amount}`, fullContext);

    // Write to dedicated payment log for security
    this.writeToFile('payments.log', this.formatLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message: `Payment ${operation}: $${amount}`,
      context: fullContext,
      environment: this.environment
    }));
  }

  // Security logging
  logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', context?: LogContext): void {
    const fullContext: ErrorContext = {
      component: 'SECURITY',
      action: 'security_event',
      severity,
      ...context
    };

    this.error(`Security Event: ${event}`, fullContext);

    // Write to dedicated security log
    this.writeToFile('security.log', this.formatLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message: `Security Event: ${event}`,
      context: fullContext,
      environment: this.environment
    }));
  }
}

// Export singleton instance
export const enhancedLogger = new EnhancedLogger();

// Convenience functions for common use cases
export const logError = (error: Error, context?: ErrorContext) => {
  enhancedLogger.error(error.message, { ...context, stack: error.stack });
};

export const logApiError = (req: any, error: Error, statusCode?: number) => {
  enhancedLogger.logApiError(req, error, statusCode);
};

export const logUserAction = (action: string, userId: string, metadata?: any) => {
  enhancedLogger.logUserAction(action, userId, { metadata });
};

export const logKbNebSync = (operation: string, result: any, itemCount?: number) => {
  enhancedLogger.logKbNebOperation(operation, result, { itemCount });
};

export const logPerformanceMetric = (operation: string, startTime: number) => {
  const duration = Date.now() - startTime;
  enhancedLogger.logPerformance(operation, duration);
};

// Middleware function for Express
export const loggingMiddleware = (req: any, res: any, next: any) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    enhancedLogger.logApiRequest(req, res, duration);
  });
  
  next();
};

export default enhancedLogger;