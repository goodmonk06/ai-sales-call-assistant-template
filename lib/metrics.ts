/**
 * Metrics Collection
 *
 * Provides a simple abstraction for collecting application metrics
 * (counters, gauges, histograms) that can be sent to monitoring systems.
 */

export interface MetricLabels {
  [key: string]: string | number | boolean
}

export interface CounterMetric {
  type: 'counter'
  name: string
  value: number
  labels?: MetricLabels
  timestamp: Date
}

export interface GaugeMetric {
  type: 'gauge'
  name: string
  value: number
  labels?: MetricLabels
  timestamp: Date
}

export interface HistogramMetric {
  type: 'histogram'
  name: string
  value: number
  labels?: MetricLabels
  timestamp: Date
}

export type Metric = CounterMetric | GaugeMetric | HistogramMetric

class MetricsCollector {
  private metrics: Metric[] = []
  private maxBufferSize = 1000

  private addMetric(metric: Metric) {
    this.metrics.push(metric)

    // Log metric in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `[Metric:${metric.type}] ${metric.name}=${metric.value}`,
        metric.labels ? JSON.stringify(metric.labels) : ''
      )
    }

    // Prevent memory leak by limiting buffer size
    if (this.metrics.length > this.maxBufferSize) {
      this.metrics.shift()
    }
  }

  /**
   * Increment a counter metric
   */
  recordCounter(name: string, value: number = 1, labels?: MetricLabels) {
    this.addMetric({
      type: 'counter',
      name,
      value,
      labels,
      timestamp: new Date(),
    })
  }

  /**
   * Record a gauge metric (snapshot of a value at a point in time)
   */
  recordGauge(name: string, value: number, labels?: MetricLabels) {
    this.addMetric({
      type: 'gauge',
      name,
      value,
      labels,
      timestamp: new Date(),
    })
  }

  /**
   * Record a histogram metric (typically for latency/duration)
   */
  recordHistogram(name: string, value: number, labels?: MetricLabels) {
    this.addMetric({
      type: 'histogram',
      name,
      value,
      labels,
      timestamp: new Date(),
    })
  }

  /**
   * Measure execution time of a function
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>, labels?: MetricLabels): Promise<T> {
    const start = Date.now()
    try {
      const result = await fn()
      const duration = Date.now() - start
      this.recordHistogram(name, duration, { ...labels, status: 'success' })
      return result
    } catch (error) {
      const duration = Date.now() - start
      this.recordHistogram(name, duration, { ...labels, status: 'error' })
      throw error
    }
  }

  /**
   * Get all collected metrics (useful for testing or exporting)
   */
  getMetrics(): Metric[] {
    return [...this.metrics]
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = []
  }

  /**
   * Get metrics summary by type
   */
  getSummary(): { counters: number; gauges: number; histograms: number } {
    return {
      counters: this.metrics.filter((m) => m.type === 'counter').length,
      gauges: this.metrics.filter((m) => m.type === 'gauge').length,
      histograms: this.metrics.filter((m) => m.type === 'histogram').length,
    }
  }
}

// Global metrics collector instance
export const metrics = new MetricsCollector()

// Convenience functions
export const recordCounter = (name: string, value?: number, labels?: MetricLabels) =>
  metrics.recordCounter(name, value, labels)

export const recordGauge = (name: string, value: number, labels?: MetricLabels) =>
  metrics.recordGauge(name, value, labels)

export const recordHistogram = (name: string, value: number, labels?: MetricLabels) =>
  metrics.recordHistogram(name, value, labels)

export const measureAsync = <T>(name: string, fn: () => Promise<T>, labels?: MetricLabels) =>
  metrics.measureAsync(name, fn, labels)

// Common application metrics
export const Metrics = {
  // API metrics
  API_REQUEST: 'api.request',
  API_ERROR: 'api.error',
  API_LATENCY: 'api.latency',

  // Database metrics
  DB_QUERY: 'db.query',
  DB_ERROR: 'db.error',
  DB_LATENCY: 'db.latency',

  // AI metrics
  AI_REQUEST: 'ai.request',
  AI_TOKENS: 'ai.tokens',
  AI_LATENCY: 'ai.latency',
  AI_ERROR: 'ai.error',

  // Business metrics
  CALL_CREATED: 'call.created',
  SCRIPT_CREATED: 'script.created',
  FEEDBACK_GENERATED: 'feedback.generated',
  COACHING_NOTE_ADDED: 'coaching_note.added',
}
