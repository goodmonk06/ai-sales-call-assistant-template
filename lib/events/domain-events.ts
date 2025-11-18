/**
 * Domain Events System
 *
 * Allows different parts of the system to react to important domain events
 * without tight coupling.
 */

export type DomainEventType =
  | 'SCRIPT_CREATED'
  | 'SCRIPT_UPDATED'
  | 'SCRIPT_PUBLISHED'
  | 'CALL_CREATED'
  | 'CALL_UPDATED'
  | 'AI_FEEDBACK_GENERATED'
  | 'COACHING_NOTE_ADDED'
  | 'USER_CREATED'
  | 'TEAM_CREATED'

export interface BaseDomainEvent {
  type: DomainEventType
  timestamp: Date
  userId?: string
  metadata?: Record<string, unknown>
}

export interface ScriptCreatedEvent extends BaseDomainEvent {
  type: 'SCRIPT_CREATED'
  scriptId: string
  scriptName: string
}

export interface ScriptUpdatedEvent extends BaseDomainEvent {
  type: 'SCRIPT_UPDATED'
  scriptId: string
  changes: string[]
}

export interface ScriptPublishedEvent extends BaseDomainEvent {
  type: 'SCRIPT_PUBLISHED'
  scriptId: string
  teamId?: string
}

export interface CallCreatedEvent extends BaseDomainEvent {
  type: 'CALL_CREATED'
  callId: string
  scriptId: string
  outcome: string
}

export interface CallUpdatedEvent extends BaseDomainEvent {
  type: 'CALL_UPDATED'
  callId: string
  changes: string[]
}

export interface AIFeedbackGeneratedEvent extends BaseDomainEvent {
  type: 'AI_FEEDBACK_GENERATED'
  callId: string
  tokensUsed?: number
}

export interface CoachingNoteAddedEvent extends BaseDomainEvent {
  type: 'COACHING_NOTE_ADDED'
  noteId: string
  callId: string
  coachId: string
  rating?: number
}

export interface UserCreatedEvent extends BaseDomainEvent {
  type: 'USER_CREATED'
  userId: string
  userRole: string
}

export interface TeamCreatedEvent extends BaseDomainEvent {
  type: 'TEAM_CREATED'
  teamId: string
  teamName: string
}

export type DomainEvent =
  | ScriptCreatedEvent
  | ScriptUpdatedEvent
  | ScriptPublishedEvent
  | CallCreatedEvent
  | CallUpdatedEvent
  | AIFeedbackGeneratedEvent
  | CoachingNoteAddedEvent
  | UserCreatedEvent
  | TeamCreatedEvent

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => void | Promise<void>

class EventBus {
  private handlers: Map<DomainEventType, EventHandler[]> = new Map()

  subscribe<T extends DomainEvent>(eventType: DomainEventType, handler: EventHandler<T>) {
    const handlers = this.handlers.get(eventType) || []
    handlers.push(handler as EventHandler)
    this.handlers.set(eventType, handlers)
  }

  async publish(event: DomainEvent) {
    const handlers = this.handlers.get(event.type) || []

    // Run all handlers (fire-and-forget style for now)
    const promises = handlers.map((handler) => {
      try {
        return Promise.resolve(handler(event))
      } catch (error) {
        console.error(`Error in event handler for ${event.type}:`, error)
        return Promise.resolve()
      }
    })

    await Promise.allSettled(promises)
  }

  // Clear all handlers (useful for testing)
  clearAll() {
    this.handlers.clear()
  }

  // Clear handlers for a specific event type
  clear(eventType: DomainEventType) {
    this.handlers.delete(eventType)
  }
}

// Global event bus instance
export const eventBus = new EventBus()

// Convenience export for publishing events
export const publishEvent = (event: DomainEvent) => eventBus.publish(event)
