/**
 * Notification Adapter Interface
 *
 * Allows the system to send notifications through various channels
 * without coupling to specific notification services.
 */

export interface NotificationPayload {
  to: string | string[]
  subject?: string
  body: string
  priority?: 'low' | 'normal' | 'high'
  metadata?: Record<string, unknown>
}

export interface INotificationAdapter {
  sendNotification(payload: NotificationPayload): Promise<void>
  sendBulkNotifications(payloads: NotificationPayload[]): Promise<void>
}

/**
 * Console Notification Adapter (for development/testing)
 */
export class ConsoleNotificationAdapter implements INotificationAdapter {
  async sendNotification(payload: NotificationPayload): Promise<void> {
    console.log('[Notification]', {
      to: payload.to,
      subject: payload.subject,
      body: payload.body.substring(0, 100) + '...',
      priority: payload.priority || 'normal',
    })
  }

  async sendBulkNotifications(payloads: NotificationPayload[]): Promise<void> {
    console.log(`[Bulk Notification] Sending ${payloads.length} notifications`)
    for (const payload of payloads) {
      await this.sendNotification(payload)
    }
  }
}

/**
 * Email Notification Adapter (stub for real implementation)
 */
export class EmailNotificationAdapter implements INotificationAdapter {
  constructor(private config: { apiKey: string; from: string }) {}

  async sendNotification(payload: NotificationPayload): Promise<void> {
    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    console.log('[Email] Would send email:', payload.subject)
    throw new Error('Email adapter not yet implemented')
  }

  async sendBulkNotifications(payloads: NotificationPayload[]): Promise<void> {
    // TODO: Batch email sending
    console.log(`[Email] Would send ${payloads.length} emails`)
    throw new Error('Email adapter not yet implemented')
  }
}

/**
 * Slack Notification Adapter (stub for real implementation)
 */
export class SlackNotificationAdapter implements INotificationAdapter {
  constructor(private config: { webhookUrl: string }) {}

  async sendNotification(payload: NotificationPayload): Promise<void> {
    // TODO: Integrate with Slack API
    console.log('[Slack] Would send to Slack:', payload.body.substring(0, 50))
    throw new Error('Slack adapter not yet implemented')
  }

  async sendBulkNotifications(payloads: NotificationPayload[]): Promise<void> {
    for (const payload of payloads) {
      await this.sendNotification(payload)
    }
  }
}

// Global notification adapter instance
let notificationAdapter: INotificationAdapter = new ConsoleNotificationAdapter()

export function setNotificationAdapter(adapter: INotificationAdapter) {
  notificationAdapter = adapter
}

export function getNotificationAdapter(): INotificationAdapter {
  return notificationAdapter
}
