/**
 * AI Adapter Interface
 *
 * Allows the system to use different AI providers for feedback generation
 * without coupling to a specific AI service.
 */

export interface AIFeedbackRequest {
  scriptBody: string
  callNotes: string
  outcome: string
  context?: Record<string, unknown>
}

export interface AIFeedbackResponse {
  feedback: string
  tokensUsed?: number
  model?: string
  metadata?: Record<string, unknown>
}

export interface IAIAdapter {
  generateCallFeedback(request: AIFeedbackRequest): Promise<AIFeedbackResponse>
}

/**
 * OpenAI Adapter (existing implementation)
 */
export class OpenAIAdapter implements IAIAdapter {
  constructor(private config: { apiKey: string; model?: string }) {}

  async generateCallFeedback(request: AIFeedbackRequest): Promise<AIFeedbackResponse> {
    const OpenAI = (await import('openai')).default

    const openai = new OpenAI({
      apiKey: this.config.apiKey,
    })

    const prompt = `あなたは経験豊富なセールスコーチです。以下の営業スクリプトと実際の通話メモを分析し、フィードバックをMarkdown形式で提供してください。

## 営業スクリプト
${request.scriptBody}

## 通話メモ
${request.callNotes}

## 結果
${request.outcome}

以下の3項目について、具体的かつ実践的なフィードバックをMarkdown形式で出力してください：

### 良かった点
- 通話で効果的だった部分を3つ挙げてください

### 改善案
- より良い結果を得るための具体的な改善提案を3つ挙げてください

### 次回使える一文
- 次回の通話で使える効果的なフレーズを1つ提案してください
`

    const response = await openai.chat.completions.create({
      model: this.config.model || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'あなたは経験豊富なセールスコーチです。営業通話の分析とフィードバックを提供します。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    return {
      feedback: response.choices[0].message.content || 'フィードバックの生成に失敗しました。',
      tokensUsed: response.usage?.total_tokens,
      model: response.model,
    }
  }
}

/**
 * Mock AI Adapter (for testing without API calls)
 */
export class MockAIAdapter implements IAIAdapter {
  async generateCallFeedback(request: AIFeedbackRequest): Promise<AIFeedbackResponse> {
    return {
      feedback: `### 良かった点
- [Mock] スクリプトに沿った説明ができていました
- [Mock] 相手の課題を引き出せていました
- [Mock] 適切なタイミングでクロージングしていました

### 改善案
- [Mock] より具体的な数字で効果を示しましょう
- [Mock] 相手の業界に特化した事例を用意しましょう
- [Mock] 次回アクションを明確にしましょう

### 次回使える一文
[Mock] 「同じ規模の企業様では、導入後3ヶ月で〇〇%の改善が見られています」`,
      tokensUsed: 0,
      model: 'mock',
      metadata: { isMock: true },
    }
  }
}

// Global AI adapter instance
let aiAdapter: IAIAdapter | null = null

export function setAIAdapter(adapter: IAIAdapter) {
  aiAdapter = adapter
}

export function getAIAdapter(): IAIAdapter {
  if (!aiAdapter) {
    const apiKey = process.env.OPENAI_API_KEY
    if (apiKey) {
      aiAdapter = new OpenAIAdapter({ apiKey })
    } else {
      console.warn('No OpenAI API key found, using Mock AI adapter')
      aiAdapter = new MockAIAdapter()
    }
  }
  return aiAdapter
}
