/**
 * Analytics Adapter Interface
 *
 * Allows the system to send analytics events to external platforms
 * without coupling to specific analytics services.
 */

export interface AnalyticsEvent {
  eventName: string
  userId?: string
  timestamp?: Date
  properties?: Record<string, unknown>
  traits?: Record<string, unknown>
}

export interface IAnalyticsAdapter {
  track(event: AnalyticsEvent): Promise<void>
  identify(userId: string, traits: Record<string, unknown>): Promise<void>
  page(userId: string, pageName: string, properties?: Record<string, unknown>): Promise<void>
}

/**
 * Console Analytics Adapter (for development/testing)
 */
export class ConsoleAnalyticsAdapter implements IAnalyticsAdapter {
  async track(event: AnalyticsEvent): Promise<void> {
    console.log('[Analytics:Track]', {
      event: event.eventName,
      user: event.userId,
      properties: event.properties,
    })
  }

  async identify(userId: string, traits: Record<string, unknown>): Promise<void> {
    console.log('[Analytics:Identify]', { userId, traits })
  }

  async page(userId: string, pageName: string, properties?: Record<string, unknown>): Promise<void> {
    console.log('[Analytics:Page]', { userId, page: pageName, properties })
  }
}

/**
 * Segment Analytics Adapter (stub for real implementation)
 */
export class SegmentAnalyticsAdapter implements IAnalyticsAdapter {
  constructor(private config: { writeKey: string }) {}

  async track(event: AnalyticsEvent): Promise<void> {
    // TODO: Integrate with Segment API
    console.log('[Segment] Would track:', event.eventName)
    throw new Error('Segment adapter not yet implemented')
  }

  async identify(userId: string, traits: Record<string, unknown>): Promise<void> {
    console.log('[Segment] Would identify:', userId)
    throw new Error('Segment adapter not yet implemented')
  }

  async page(userId: string, pageName: string, properties?: Record<string, unknown>): Promise<void> {
    console.log('[Segment] Would track page:', pageName)
    throw new Error('Segment adapter not yet implemented')
  }
}

// Global analytics adapter instance
let analyticsAdapter: IAnalyticsAdapter = new ConsoleAnalyticsAdapter()

export function setAnalyticsAdapter(adapter: IAnalyticsAdapter) {
  analyticsAdapter = adapter
}

export function getAnalyticsAdapter(): IAnalyticsAdapter {
  return analyticsAdapter
}
