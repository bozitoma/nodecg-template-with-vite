/**
 * NodeCG バンドル名の定義
 * バンドル名はpackage.jsonのnameフィールドと一致させてください。
 */
export const BUNDLE_NAME = 'nodecg-template-with-vite' as const;
export type BundleName = typeof BUNDLE_NAME;
