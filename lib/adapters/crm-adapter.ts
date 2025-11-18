/**
 * CRM Adapter Interface
 *
 * Allows the system to sync call logs and outcomes to external CRM systems
 * without coupling to specific CRM platforms.
 */

export interface CRMContact {
  id?: string
  name: string
  email?: string
  company?: string
  phone?: string
  metadata?: Record<string, unknown>
}

export interface CRMActivity {
  contactId: string
  type: 'call' | 'email' | 'meeting' | 'note'
  subject: string
  description: string
  date: Date
  outcome?: string
  metadata?: Record<string, unknown>
}

export interface ICRMAdapter {
  createOrUpdateContact(contact: CRMContact): Promise<string> // Returns contact ID
  createActivity(activity: CRMActivity): Promise<string> // Returns activity ID
  getContact(contactId: string): Promise<CRMContact | null>
  searchContacts(query: string): Promise<CRMContact[]>
}

/**
 * In-Memory CRM Adapter (for development/testing)
 */
export class InMemoryCRMAdapter implements ICRMAdapter {
  private contacts: Map<string, CRMContact> = new Map()
  private activities: Map<string, CRMActivity> = new Map()

  async createOrUpdateContact(contact: CRMContact): Promise<string> {
    const id = contact.id || `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.contacts.set(id, { ...contact, id })
    console.log('[CRM] Created/Updated contact:', id)
    return id
  }

  async createActivity(activity: CRMActivity): Promise<string> {
    const id = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.activities.set(id, activity)
    console.log('[CRM] Created activity:', id, 'for contact:', activity.contactId)
    return id
  }

  async getContact(contactId: string): Promise<CRMContact | null> {
    return this.contacts.get(contactId) || null
  }

  async searchContacts(query: string): Promise<CRMContact[]> {
    const results: CRMContact[] = []
    for (const contact of this.contacts.values()) {
      if (
        contact.name.toLowerCase().includes(query.toLowerCase()) ||
        contact.email?.toLowerCase().includes(query.toLowerCase()) ||
        contact.company?.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push(contact)
      }
    }
    return results
  }
}

/**
 * Salesforce CRM Adapter (stub for real implementation)
 */
export class SalesforceCRMAdapter implements ICRMAdapter {
  constructor(private config: { instanceUrl: string; accessToken: string }) {}

  async createOrUpdateContact(contact: CRMContact): Promise<string> {
    // TODO: Integrate with Salesforce API
    console.log('[Salesforce] Would create/update contact:', contact.name)
    throw new Error('Salesforce adapter not yet implemented')
  }

  async createActivity(activity: CRMActivity): Promise<string> {
    // TODO: Integrate with Salesforce API
    console.log('[Salesforce] Would create activity:', activity.subject)
    throw new Error('Salesforce adapter not yet implemented')
  }

  async getContact(contactId: string): Promise<CRMContact | null> {
    console.log('[Salesforce] Would get contact:', contactId)
    throw new Error('Salesforce adapter not yet implemented')
  }

  async searchContacts(query: string): Promise<CRMContact[]> {
    console.log('[Salesforce] Would search contacts:', query)
    throw new Error('Salesforce adapter not yet implemented')
  }
}

// Global CRM adapter instance
let crmAdapter: ICRMAdapter = new InMemoryCRMAdapter()

export function setCRMAdapter(adapter: ICRMAdapter) {
  crmAdapter = adapter
}

export function getCRMAdapter(): ICRMAdapter {
  return crmAdapter
}
