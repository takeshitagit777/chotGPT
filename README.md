# 生成できない問題の修正パッチ

## 上書きするファイル

- api/generate.ts

## src/App.tsx の修正

`handleGenerate` だけ、README下部のコードに置き換えてください。

## CSS

`src/App.css` の一番下に `css-addon.txt` の内容を追記してください。

## package.json

`dependencies` に `openai` がなければ追加してください。

```json
"openai": "latest"
```

## Vercel環境変数

Project Settings > Environment Variables に以下が必要です。

```txt
OPENAI_API_KEY=sk-...
```

任意でモデルを指定できます。

```txt
OPENAI_MODEL=gpt-4.1-mini
```

## App.tsx の handleGenerate 置き換え

```tsx
const handleGenerate = async () => {
  setIsGenerating(true);
  setGenerated(null);
  setErrorMessage('');

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ era, place, role, mood }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || data?.error || '生成APIでエラーが発生しました。');
    }

    if (!data.result) {
      throw new Error('生成結果が空でした。');
    }

    setGenerated(data.result);
  } catch (e: any) {
    setErrorMessage(e?.message || '生成に失敗しました。Vercelのログを確認してください。');
    setGenerated(null);
  } finally {
    setIsGenerating(false);
  }
};
```
