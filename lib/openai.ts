import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateCallFeedback(
  scriptBody: string,
  callNotes: string,
  outcome: string
): Promise<string> {
  try {
    const prompt = `あなたは経験豊富なセールスコーチです。以下の営業スクリプトと実際の通話メモを分析し、フィードバックをMarkdown形式で提供してください。

## 営業スクリプト
${scriptBody}

## 通話メモ
${callNotes}

## 結果
${outcome}

以下の3項目について、具体的かつ実践的なフィードバックをMarkdown形式で出力してください：

### 良かった点
- 通話で効果的だった部分を3つ挙げてください

### 改善案
- より良い結果を得るための具体的な改善提案を3つ挙げてください

### 次回使える一文
- 次回の通話で使える効果的なフレーズを1つ提案してください
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
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

    return response.choices[0].message.content || 'フィードバックの生成に失敗しました。'
  } catch (error) {
    console.error('Error generating AI feedback:', error)
    throw new Error('AI feedback generation failed')
  }
}
