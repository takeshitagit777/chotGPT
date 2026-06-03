# Build Failed 修正版パッチ

前回の版は `react-router-dom` を追加していたため、既存環境・lockfile・Vercel設定によってビルドが落ちる可能性がありました。

この版は **React Routerを使わない** 形に変更しています。
そのため、新しいフロント依存関係なしで動きます。

## 上書きするファイル

ZIPの中身を、GitHubリポジトリの同じ場所へ上書きしてください。

```txt
package.json
tsconfig.json
vite.config.ts
index.html
src/main.tsx
src/index.css
src/App.tsx
src/App.css
api/generate.ts
api/chat-send.ts
```

## 削除しなくてもよいファイル

前回追加した以下のファイルは残っていても問題ありません。
今回の `src/App.tsx` では読み込まないため、ビルド対象外です。

```txt
src/pages/*
src/components/*
src/lib/*
```

## 画像はそのまま

```txt
public/feature-album.jpg
public/feature-line.jpg
public/feature-sns.jpg
public/feature-search.jpg
public/feature-diary.jpg
public/feature-item.jpg
public/feature-music.jpg
```

## 動く画面

- `/#/` ホーム
- `/#/friends` 友達一覧
- `/#/chat/yui` 会話
- `/#/albums` アルバム一覧
- `/#/albums/summer` アルバム詳細

## Vercel環境変数

既存のままです。

```txt
OPENAI_API_KEY=sk-...
```
