# AI営業通話アシスタント

電話営業スクリプトをAIで最適化・ログ管理するためのアシスタント。通話メモから次回アクションを提案。

## Overview

インサイドセールスチームのための営業通話支援システムです。営業スクリプトをテンプレート化し、通話ログをAIが分析して改善点や次回使えるフレーズを自動生成します。

### 主な機能

- **スクリプトテンプレート管理**: 対象顧客別の営業スクリプトを作成・編集・削除
- **通話ログ記録**: 通話内容と結果を記録し、一覧・詳細表示
- **AIフィードバック**: OpenAI APIを使用して、通話内容から以下を自動生成
  - 良かった点（3つ）
  - 改善案（3つ）
  - 次回使える効果的なフレーズ（1つ）

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, React Markdown
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **AI**: OpenAI API (GPT-4o-mini)
- **Validation**: Zod
- **Testing**: Vitest
- **Containerization**: Docker, Docker Compose

## Domain Model

### ScriptTemplate（スクリプトテンプレート）
営業スクリプトのテンプレート

- `id`: 一意識別子
- `name`: スクリプト名
- `targetProfile`: 対象顧客プロファイル（例: 歯科医院、整骨院）
- `purpose`: 目的（例: アポ取得、商品紹介）
- `bodyMarkdown`: スクリプト本文（Markdown形式）
- `createdAt`: 作成日時
- `updatedAt`: 更新日時
- `callLogs`: 関連する通話ログ（1対多）

### CallLog（通話ログ）
実際の通話記録とAIフィードバック

- `id`: 一意識別子
- `scriptTemplateId`: 使用したスクリプトテンプレートID（外部キー）
- `scriptTemplate`: スクリプトテンプレート（リレーション）
- `callDate`: 通話日
- `outcome`: 結果（アポ獲得、検討中、見送り、不在、その他）
- `notes`: 通話メモ
- `aiFeedbackMarkdown`: AIフィードバック（Markdown形式）
- `createdAt`: 作成日時
- `updatedAt`: 更新日時

## Getting Started

### Requirements

- Node.js 20.x以上
- PostgreSQL 16.x以上（またはDocker）
- OpenAI API Key

### Setup Steps

#### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd ai-sales-call-assistant-template
```

#### 2. 依存関係のインストール

```bash
npm install
```

#### 3. 環境変数の設定

`.env.example`をコピーして`.env`を作成：

```bash
cp .env.example .env
```

`.env`を編集してAPIキーとデータベースURLを設定：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_sales_assistant?schema=public"
OPENAI_API_KEY="sk-your-openai-api-key"
```

#### 4. データベースのセットアップ

##### オプション A: Docker Composeを使用（推奨）

PostgreSQLをDockerで起動：

```bash
docker compose -f docker-compose.dev.yml up -d
```

データベースマイグレーションを実行：

```bash
npm run db:push
# または
npm run db:migrate
```

サンプルデータをシード：

```bash
npm run db:seed
```

##### オプション B: ローカルのPostgreSQLを使用

ローカルのPostgreSQLに接続する場合は、`.env`の`DATABASE_URL`を適切に設定してから：

```bash
npm run db:push
npm run db:seed
```

#### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### Docker で完全に起動する場合

アプリケーション全体をDockerで起動：

```bash
# .envファイルにOPENAI_API_KEYを設定してから
docker compose up --build
```

アプリケーションは [http://localhost:3000](http://localhost:3000) で利用可能になります。

## Example Flow（垂直スライス）

### 完全なエンドツーエンドフロー

1. **スクリプトテンプレート作成**
   - `/scripts` にアクセス
   - 「新規作成」ボタンをクリック
   - 歯科医院向けスクリプトを入力
   - 「保存」をクリック
   - → API POST `/api/scripts` が呼ばれ、データベースに保存

2. **通話ログ登録**
   - `/calls/new` にアクセス
   - 作成したスクリプトを選択
   - 通話日、結果、メモを入力
   - 「登録」をクリック
   - → API POST `/api/calls` が呼ばれる
   - → OpenAI APIでフィードバックを生成
   - → データベースに保存
   - → AIフィードバックが表示される

3. **通話ログ一覧表示**
   - `/calls` にアクセス
   - 登録した通話ログの一覧が表示される
   - → API GET `/api/calls` が呼ばれる

4. **通話ログ詳細表示**
   - 一覧からログをクリック
   - `/calls/[id]` にアクセス
   - スクリプト、メモ、AIフィードバックが表示される
   - → API GET `/api/calls/[id]` が呼ばれる

5. **削除・更新**
   - 詳細ページから削除可能
   - スクリプトページから編集可能
   - → API DELETE, PUT が呼ばれる

### デモデータ

Seedスクリプトを実行すると、以下のサンプルデータが作成されます：

- **スクリプトテンプレート**: 3件
  - 歯科医院向け予約システム導入アポ取得
  - 整骨院向け電子カルテ導入提案
  - 美容院向けPOSシステム営業

- **通話ログ**: 4件
  - アポ獲得: 2件
  - 検討中: 1件
  - 見送り: 1件

すべてのログにAIフィードバックが含まれています。

## Available Scripts

```bash
# 開発
npm run dev              # 開発サーバー起動
npm run build            # プロダクションビルド
npm run start            # プロダクションサーバー起動
npm run lint             # ESLint実行

# テスト
npm test                 # テスト実行
npm run test:watch       # テストをwatchモードで実行

# データベース
npm run db:generate      # Prisma Client生成
npm run db:push          # データベーススキーマをプッシュ（開発用）
npm run db:migrate       # マイグレーション作成・実行（本番推奨）
npm run db:migrate:deploy # マイグレーション適用（本番用）
npm run db:seed          # サンプルデータ投入
npm run db:studio        # Prisma Studio起動
```

## API Endpoints

### スクリプトテンプレート

- `GET /api/scripts` - スクリプトテンプレート一覧取得
- `POST /api/scripts` - スクリプトテンプレート作成
- `GET /api/scripts/[id]` - スクリプトテンプレート詳細取得
- `PUT /api/scripts/[id]` - スクリプトテンプレート更新
- `DELETE /api/scripts/[id]` - スクリプトテンプレート削除

### 通話ログ

- `GET /api/calls` - 通話ログ一覧取得（最新50件）
- `POST /api/calls` - 通話ログ作成（AIフィードバック自動生成）
- `GET /api/calls/[id]` - 通話ログ詳細取得
- `DELETE /api/calls/[id]` - 通話ログ削除

すべてのAPIはZodバリデーション、統一エラーハンドリング、型安全性を備えています。

## Testing

```bash
# すべてのテストを実行
npm test

# watchモードでテスト
npm run test:watch
```

テストカバレッジ：
- バリデーションロジック（Zod schemas）
- エラーハンドリング（ApiError, handleApiError）

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── scripts/        # スクリプトテンプレートAPI
│   │   │   ├── route.ts    # GET, POST
│   │   │   └── [id]/
│   │   │       └── route.ts # GET, PUT, DELETE
│   │   └── calls/          # 通話ログAPI
│   │       ├── route.ts    # GET, POST
│   │       └── [id]/
│   │           └── route.ts # GET, DELETE
│   ├── scripts/            # スクリプト管理ページ
│   │   └── page.tsx
│   ├── calls/
│   │   ├── page.tsx        # 通話ログ一覧
│   │   ├── new/
│   │   │   └── page.tsx    # 通話ログ登録
│   │   └── [id]/
│   │       └── page.tsx    # 通話ログ詳細
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── prisma.ts          # Prisma Client
│   ├── openai.ts          # OpenAI API連携
│   ├── validations.ts     # Zod schemas
│   └── api-error.ts       # エラーハンドリング
├── prisma/
│   ├── schema.prisma      # データベーススキーマ
│   └── seed.ts            # Seedスクリプト
├── __tests__/
│   └── lib/
│       ├── validations.test.ts
│       └── api-error.test.ts
├── Dockerfile
├── docker-compose.yml      # 本番用Docker Compose
├── docker-compose.dev.yml  # 開発用Docker Compose
├── vitest.config.ts
└── package.json
```

## Future Extensions

- [ ] ユーザー認証・認可（NextAuth.js）
- [ ] チーム機能（複数ユーザー対応）
- [ ] 通話録音の文字起こし機能（Whisper API）
- [ ] ダッシュボード（成約率、AIフィードバック活用率など）
- [ ] スクリプトのバージョン管理
- [ ] AIフィードバックの再生成機能
- [ ] エクスポート機能（CSV、PDF）
- [ ] 通話ログへのタグ付け
- [ ] より詳細な検索・フィルタリング
- [ ] リアルタイム通知（新規ログ登録時）

## License

MIT
