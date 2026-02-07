# NodeCG Template with Vite

NodeCG を用いたライブ配信グラフィックを、React と TypeScript で効率よく構築するための開発用テンプレートです。Vite による高速な開発サイクルと、型安全なデータ同期（Replicant）をすぐに始められるように最適化されています。

## 前提条件

- **Node.js**: v22 以上 (LTS推奨)
- **pnpm**: パッケージマネージャー (Corepackで有効化してください)
- **Git**

## クイックスタート

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動 (Vite + NodeCG)
pnpm dev

# ビルドと本番実行
pnpm build
npx nodecg start
```

## 開発の仕組み

このテンプレートは、`src/` 内のソースコードを Vite でビルドし、NodeCG が認識するバンドル構造（ルートの `dashboard/`, `graphics/`, `extension/`, `schemas/`）を自動生成します。

- **自動HTML生成**: `src/browser/dashboard/foo/index.tsx` を作成すると、ビルド時に `./dashboard/foo.html` が自動生成されます。
- **型安全な通信**: Zod スキーマと TypeScript の型定義を組み合わせることで、Dashboard / Graphics / Extension 間の通信を完全に補完・チェックできます。

## 開発手順ガイド

新しい機能（例：スコアボード）を追加する標準的なフローは以下の通りです。

### 1. データ構造の定義 (`src/schemas`)
`Zod` を使用して、同期したいデータ（Replicant）の構造を定義します。
- `src/schemas/scoreboard.ts` を作成しスキーマを定義。
- `src/schemas/index.ts` からエクスポート。

### 2. 型定義の紐付け (`src/nodecg`)
Replicant や Message の名前に型を紐付けます。これにより、エディタで強力な補完が効くようになります。
- **Replicant**: `src/nodecg/replicants.d.ts` の `ReplicantMap` に登録。
- **Message**: `src/nodecg/messages.d.ts` の `MessageMap` に登録。

### 3. フロントエンドの実装 (`src/browser`)
`src/browser/dashboard/` または `graphics/` 以下にディレクトリを作成します。
- **Dashboard**: 操作パネルの実装。`useReplicant` フックで値を更新します。
- **Graphics**: 配信画面（オーバーレイ）の実装。`useReplicant` フックで値を監視し描画します。
- **CSS**: 各ディレクトリに `.css` を配置し、`index.tsx` で import します。

### 4. バックエンドの実装 (`src/extension`)
ブラウザを閉じても動かしたいロジック（タイマー等）や、機密情報を扱う処理（API連携）を記述します。
- `src/extension/index.ts` がエントリポイントです。必要に応じてファイルを分割して読み込んでください。

### 5. マニフェストへの登録 (`package.json`)
作成した HTML ファイルを NodeCG に認識させるため、`package.json` の `nodecg` セクションにパネルやグラフィックスの設定を追記します。

## プロジェクト構成（詳細）

```text
.
├── bundleName.ts              # バンドル名の定義（URLや型定義に使用）
├── cfg/                       # NodeCG 設定ファイル (.gitignore対象)
├── configschema.json          # NodeCG 設定のバリデーションスキーマ
├── src/                       # 編集対象のソースコード
│   ├── browser/               # フロントエンド（React）
│   │   ├── dashboard/         # ダッシュボードパネル (src/browser/dashboard/*/index.tsx)
│   │   ├── graphics/          # グラフィックス (src/browser/graphics/*/index.tsx)
│   │   ├── hooks/             # 共用 Hooks (useReplicant等)
│   │   └── global.css         # リセットCSS・共通の変数定義
│   ├── extension/             # バックエンド (Node.js/Rollupビルド)
│   ├── nodecg/                # Replicant / Message の型定義
│   └── schemas/               # Zod スキーマ定義
├── vite.config.mts            # Vite 設定
└── vite-plugin-nodecg.mts     # NodeCG 連携用 Vite プラグイン
```

> [!CAUTION]
> ルートにある `/dashboard`, `/graphics`, `/extension`, `/shared`, `/schemas` はビルド成果物です。**これらを直接編集しないでください。** 編集は必ず `src/` 内で行います。

## 詳細な解説リソース

本テンプレートを使用した具体的な実装例（スコアボード、タイマー、外部API連携など）については、以下の Zenn Book で詳しく解説しています。

- **[NodeCG 配信グラフィック開発入門](https://zenn.dev/bozitoma/books/nodecg-react-overlay)**

## ライセンス

MIT (詳細は [LICENSE](./LICENSE) を参照)
