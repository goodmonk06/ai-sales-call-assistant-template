import { getAIAdapter } from './adapters/ai-adapter'
import { logger } from './logger'
import { measureAsync, recordCounter, recordGauge, Metrics } from './metrics'

/**
 * Generate AI feedback for a call log
 * Uses the configured AI adapter (OpenAI, mock, or custom)
 */
export async function generateCallFeedback(
  scriptBody: string,
  callNotes: string,
  outcome: string
): Promise<string> {
  return measureAsync(
    Metrics.AI_LATENCY,
    async () => {
      try {
        logger.info('Generating AI feedback', {
          scriptLength: scriptBody.length,
          notesLength: callNotes.length,
          outcome,
        })

        recordCounter(Metrics.AI_REQUEST, 1, { type: 'call_feedback' })

        const adapter = getAIAdapter()
        const response = await adapter.generateCallFeedback({
          scriptBody,
          callNotes,
          outcome,
        })

        if (response.tokensUsed) {
          recordGauge(Metrics.AI_TOKENS, response.tokensUsed, {
            model: response.model || 'unknown',
          })
        }

        recordCounter(Metrics.FEEDBACK_GENERATED, 1, {
          model: response.model || 'unknown',
        })

        logger.info('AI feedback generated successfully', {
          tokensUsed: response.tokensUsed,
          model: response.model,
        })

        return response.feedback
      } catch (error) {
        recordCounter(Metrics.AI_ERROR, 1, { type: 'call_feedback' })

        logger.error('Error generating AI feedback', error instanceof Error ? error : undefined, {
          scriptLength: scriptBody.length,
          notesLength: callNotes.length,
        })

        throw new Error('AI feedback generation failed')
      }
    },
    { type: 'call_feedback' }
  )
}
