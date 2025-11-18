export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">AI営業通話アシスタント</h1>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">このツールについて</h2>
        <p className="text-gray-700">
          電話営業スクリプトをAIで最適化し、通話ログを管理するアシスタントツールです。
          通話メモから次回のアクションを自動提案します。
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <a
          href="/scripts"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50"
        >
          <h3 className="text-xl font-semibold mb-2">スクリプト管理</h3>
          <p className="text-gray-600">営業スクリプトテンプレートの作成・編集</p>
        </a>

        <a
          href="/calls/new"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50"
        >
          <h3 className="text-xl font-semibold mb-2">通話ログ登録</h3>
          <p className="text-gray-600">通話内容を記録し、AIからフィードバックを受け取る</p>
        </a>
      </div>
    </div>
  );
}
