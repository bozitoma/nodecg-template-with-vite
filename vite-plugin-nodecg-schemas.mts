import { zodToJsonSchema } from 'zod-to-json-schema';
import type { Plugin } from 'vite';
import fs from 'fs/promises';
import path from 'path';
import { build } from 'esbuild';
import { pathToFileURL } from 'url';

/**
 * src/schemas/index.ts から全ての *Schema を自動検出してJSON Schemaを生成
 */
async function generateSchemas() {
  await fs.mkdir('schemas', { recursive: true });

  // 一時的なJSファイルを生成するためのパス
  const tempDir = path.join('.temp');
  const tempFile = path.join(tempDir, 'schemas.mjs');

  try {
    // esbuildでTypeScriptをESMに変換
    await build({
      entryPoints: ['src/schemas/index.ts'],
      bundle: true,
      format: 'esm',
      platform: 'node',
      outfile: tempFile,
      external: ['zod'], // zodは外部パッケージとして扱う
    });

    // 変換されたJSファイルをインポート
    const schemasUrl = pathToFileURL(path.resolve(tempFile)).href;
    const schemas = await import(schemasUrl);

    // *Schema で終わるエクスポートを検出して処理
    for (const [key, schema] of Object.entries(schemas)) {
      if (key.endsWith('Schema') && typeof schema === 'object' && schema !== null) {
        // スキーマ名を取得（例: alertSchema -> alert）
        const name = key.replace(/Schema$/, '');

        console.log(`\n[nodecg-schemas] Processing: ${key}`);
        console.log(`[nodecg-schemas] Schema constructor:`, schema.constructor.name);

        try {
          // ZodスキーマをJSON Schemaに変換
          const jsonSchema = zodToJsonSchema(schema as any, {
            target: 'jsonSchema7',
            $refStrategy: 'none',
          });

          console.log(`[nodecg-schemas] Generated JSON Schema:`, JSON.stringify(jsonSchema, null, 2));

          // schemas/{name}.json に保存
          await fs.writeFile(
            path.join('schemas', `${name}.json`),
            JSON.stringify(jsonSchema, null, 2)
          );

          console.log(`[nodecg-schemas] ✓ Generated: schemas/${name}.json`);
        } catch (error) {
          console.error(`[nodecg-schemas] ✗ Error generating schema for ${key}:`, error);
        }
      }
    }
  } finally {
    // 一時ファイルをクリーンアップ
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      // クリーンアップ失敗は無視
    }
  }
}

export function nodecgSchemas(): Plugin {
  return {
    name: 'nodecg-schemas',

    async buildStart() {
      // ビルド開始時にスキーマを生成
      await generateSchemas();
    },

    async configureServer(server) {
      // 開発サーバー起動時にスキーマファイルの変更を監視
      server.watcher.add('src/schemas/**/*.ts');

      server.watcher.on('change', async (file) => {
        if (file.includes('src/schemas')) {
          console.log('Schema file changed, regenerating JSON schemas...');
          await generateSchemas();
        }
      });
    },
  };
}
