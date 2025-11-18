/**
 * Structured Logger
 *
 * Provides consistent logging throughout the application with support for
 * correlation IDs, contexts, and structured data.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  correlationId?: string
  userId?: string
  requestId?: string
  [key: string]: unknown
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  context?: LogContext
  error?: Error
  data?: Record<string, unknown>
}

class Logger {
  private context: LogContext = {}
  private minLevel: LogLevel

  constructor() {
    this.minLevel = (process.env.LOG_LEVEL as LogLevel) || 'info'
  }

  setContext(context: LogContext) {
    this.context = { ...this.context, ...context }
  }

  clearContext() {
    this.context = {}
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    return levels.indexOf(level) >= levels.indexOf(this.minLevel)
  }

  private formatEntry(entry: LogEntry): string {
    const { level, message, timestamp, context, error, data } = entry

    const parts: string[] = [
      `[${timestamp.toISOString()}]`,
      `[${level.toUpperCase()}]`,
      message,
    ]

    if (context && Object.keys(context).length > 0) {
      parts.push(JSON.stringify(context))
    }

    if (data && Object.keys(data).length > 0) {
      parts.push(JSON.stringify(data))
    }

    if (error) {
      parts.push(`\nError: ${error.message}`)
      if (error.stack) {
        parts.push(error.stack)
      }
    }

    return parts.join(' ')
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown>, error?: Error) {
    if (!this.shouldLog(level)) {
      return
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context: { ...this.context },
      data,
      error,
    }

    const formatted = this.formatEntry(entry)

    switch (level) {
      case 'debug':
        console.debug(formatted)
        break
      case 'info':
        console.log(formatted)
        break
      case 'warn':
        console.warn(formatted)
        break
      case 'error':
        console.error(formatted)
        break
    }
  }

  debug(message: string, data?: Record<string, unknown>) {
    this.log('debug', message, data)
  }

  info(message: string, data?: Record<string, unknown>) {
    this.log('info', message, data)
  }

  warn(message: string, data?: Record<string, unknown>) {
    this.log('warn', message, data)
  }

  error(message: string, errorOrData?: Error | Record<string, unknown>, data?: Record<string, unknown>) {
    if (errorOrData instanceof Error) {
      this.log('error', message, data, errorOrData)
    } else {
      this.log('error', message, errorOrData)
    }
  }

  // Create a child logger with additional context
  child(context: LogContext): Logger {
    const childLogger = new Logger()
    childLogger.setContext({ ...this.context, ...context })
    return childLogger
  }
}

// Global logger instance
export const logger = new Logger()

// Convenience functions
export const debug = (message: string, data?: Record<string, unknown>) => logger.debug(message, data)
export const info = (message: string, data?: Record<string, unknown>) => logger.info(message, data)
export const warn = (message: string, data?: Record<string, unknown>) => logger.warn(message, data)
export const error = (message: string, errorOrData?: Error | Record<string, unknown>, data?: Record<string, unknown>) =>
  logger.error(message, errorOrData, data)
