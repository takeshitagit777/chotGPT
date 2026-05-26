# 架空自分史 アプリ拡張パッチ

## 追加されるもの

- ホーム
- 友達一覧 `/friends`
- 会話画面 `/chat/:friendId`
- アルバム一覧 `/albums`
- アルバム詳細 `/albums/:albumId`
- OpenAI APIでキャラクター会話する `/api/chat-send`
- 世界線生成時に友達・アルバムも生成
- ローカル保存 localStorage

## 上書き・追加するファイル

ZIPの中身を、GitHubリポジトリの同じ場所にそのまま上書きしてください。

```txt
package.json
index.html
src/main.tsx
src/index.css
src/App.css
src/App.tsx
src/components/AppShell.tsx
src/pages/HomePage.tsx
src/pages/FriendsPage.tsx
src/pages/ChatPage.tsx
src/pages/AlbumsPage.tsx
src/pages/AlbumDetailPage.tsx
src/lib/types.ts
src/lib/defaultWorld.ts
src/lib/storage.ts
src/lib/api.ts
api/generate.ts
api/chat-send.ts
```

## public配下の画像

既存のままでOKです。

```txt
public/feature-album.jpg
public/feature-line.jpg
public/feature-sns.jpg
public/feature-search.jpg
public/feature-diary.jpg
public/feature-item.jpg
public/feature-music.jpg
```

## Vercel環境変数

既存のままでOKです。

```txt
OPENAI_API_KEY=sk-...
```

任意:

```txt
OPENAI_MODEL=gpt-4.1-mini
```

## 注意

package.json に `react-router-dom` を追加しています。
GitHubに反映すると、Vercel側で自動的に install/build されます。
