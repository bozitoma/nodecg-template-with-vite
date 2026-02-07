# NodeCG Template with Vite

NodeCG + Vite + React + TypeScript を使用した配信オーバーレイ開発テンプレートです。

## 使い方

### 開発サーバーの起動

```bash
npm run dev
```

Vite の開発サーバーと NodeCG サーバーが同時に起動します。

- **NodeCG ダッシュボード**: http://localhost:9090
- **Vite 開発サーバー**: http://localhost:8080

### プロダクションビルド

```bash
npm run build
nodecg start
```

## 設定

### バンドル名 (Bundle Name)

バンドル名は `bundleName.ts` で一元管理しています：

```typescript
// bundleName.ts
export const BUNDLE_NAME = 'nodecg-template-with-vite' as const;
export type BundleName = typeof BUNDLE_NAME;
```

> [!IMPORTANT]
> **バンドル名はプロジェクトのフォルダ名と一致させる必要があります。**
> NodeCG はフォルダ名をバンドル名として認識するため、`BUNDLE_NAME` の値を変更する場合はフォルダ名も合わせて変更してください。

バンドル名は以下のファイルで使用されています：

- `bundleName.ts` - 定数定義
- `vite.config.mts` - ビルド設定
- `src/browser/global.d.ts` - ブラウザ側の型定義
- `src/extension/nodecg.d.ts` - Extension 側の型定義

### バンドル設定 (Bundle Configuration)

バンドル固有の設定は NodeCG の `cfg` ディレクトリを使用して管理します。

#### 1. 設定スキーマの定義

`src/schemas/bundleConfig.ts` で Zod スキーマを定義します：

```typescript
// src/schemas/bundleConfig.ts
import { z } from "zod";

export const bundleConfigSchema = z.object({
  // 例：API トークンの設定
  apiToken: z.string().optional(),
});

export type BundleConfig = z.infer<typeof bundleConfigSchema>;
```

#### 2. JSON Schema の作成

NodeCG はバンドル設定のバリデーションに JSON Schema を使用します。プロジェクトルートに `configschema.json` を作成します：

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "apiToken": {
      "type": "string",
      "description": "API トークン"
    }
  }
}
```

#### 3. 設定ファイルの作成

`cfg/<バンドル名>.json` に設定ファイルを作成します：

```json
// cfg/nodecg-template-with-vite.json
{
  "apiToken": "your-api-token-here"
}
```

> [!NOTE]
> 設定ファイルは `.js`、`.yaml`、`.json` 形式に対応しています。
> 詳細は [NodeCG 公式ドキュメント](https://www.nodecg.dev/ja/docs/bundle-configuration) を参照してください。

#### 4. Extension での設定値の使用

```typescript
// src/extension/index.ts
export default (nodecg: NodeCG) => {
  const config = nodecg.bundleConfig;
  console.log(config.apiToken); // 型安全にアクセス可能
};
```

## プロジェクト構成

```text
.
├── bundleName.ts              # バンドル名の定義
├── cfg/                       # NodeCG 設定ファイル
├── configschema.json          # バンドル設定の JSON Schema
├── src/                       # ソースコード (Viteでビルド)
│   ├── browser/               # フロントエンド（Dashboard / Graphics）
│   │   ├── dashboard/         # 各ダッシュボードパネルのソース
│   │   ├── graphics/          # 各グラフィックス（オーバーレイ）のソース
│   │   ├── hooks/             # 共用 Hooks (useReplicant等)
│   │   └── global.d.ts        # ブラウザ側の型定義
│   ├── extension/             # バックエンド（NodeCG Extension）
│   │   └── nodecg.d.ts        # Extension 側の型定義
│   ├── nodecg/                # NodeCG 内部の型定義（Replicants, Messages）
│   └── schemas/               # Zod スキーマ（データバリデーション）
├── books/                     # Zenn Book チャプター原稿 (Markdown)
├── images/                    # 記事用画像リソース
├── vite.config.mts            # Vite 設定
└── vite-plugin-nodecg.mts     # NodeCG 用 Vite プラグイン
```

> [!CAUTION]
> ルートにある `/dashboard`, `/graphics`, `/extension`, `/shared`, `/schemas` フォルダはビルドによって自動生成される成果物です。
> これらを直接編集しても `src/` 内のソースコードには反映されず、ビルド時に上書きされるため注意してください。


## ライセンス

MIT
