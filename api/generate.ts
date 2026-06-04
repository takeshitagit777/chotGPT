import OpenAI from "openai";

type RateRecord = {
  date: string;
  count: number;
};

const DAILY_LIMIT = 3;

const globalStore = globalThis as any;
if (!globalStore.__kakuJibunshiDailyStore) {
  globalStore.__kakuJibunshiDailyStore = new Map<string, RateRecord>();
}
const dailyStore: Map<string, RateRecord> = globalStore.__kakuJibunshiDailyStore;

function getJstDateKey() {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getClientKey(req: any) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip =
    typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0].trim()
      : req.socket?.remoteAddress || "unknown";

  return `ip:${ip}`;
}

function getRateStatus(req: any) {
  const today = getJstDateKey();
  const key = getClientKey(req);
  const current = dailyStore.get(key);

  if (!current || current.date !== today) {
    return { key, today, remaining: DAILY_LIMIT, allowed: true };
  }

  return {
    key,
    today,
    remaining: Math.max(DAILY_LIMIT - current.count, 0),
    allowed: current.count < DAILY_LIMIT,
  };
}

function incrementRateLimit(key: string, today: string) {
  const current = dailyStore.get(key);

  if (!current || current.date !== today) {
    dailyStore.set(key, { date: today, count: 1 });
    return DAILY_LIMIT - 1;
  }

  current.count += 1;
  dailyStore.set(key, current);
  return Math.max(DAILY_LIMIT - current.count, 0);
}

function extractJson(text: string) {
  const cleaned = String(text || "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");

  if (first === -1 || last === -1) {
    throw new Error("JSON object was not found in model output.");
  }

  return JSON.parse(cleaned.slice(first, last + 1));
}

function fallbackCharacters() {
  return [
    {
      id: "yui",
      name: "ゆい",
      relationship: "同級生",
      age: "17",
      personality: "明るいが、ふとした瞬間に寂しさが出る。",
      speakingStyle: "短めで自然。絵文字は少なめ。",
      backstory: "放課後によく一緒に帰る友達。",
      avatar: "ゆ",
      latestMessage: "今日、帰り寄り道しよ？",
      unread: 2
    }
  ];
}

function normalizeResult(raw: any, input: any) {
  const albumText = Array.isArray(raw?.album) ? raw.album : [];
  const search = Array.isArray(raw?.search) ? raw.search : [];
  const characters = Array.isArray(raw?.characters) && raw.characters.length ? raw.characters : fallbackCharacters();
  const albums = Array.isArray(raw?.albums) && raw.albums.length ? raw.albums : [
    {
      id: "generated-album",
      title: "生成された記録",
      description: "あなたの設定から生まれた架空アルバム。",
      coverUrl: "/feature-album.jpg",
      photos: albumText.slice(0, 4).map((caption: string, index: number) => ({
        id: `photo-${index + 1}`,
        title: `記録 ${index + 1}`,
        caption,
        date: `${input.era}`,
        imageUrl: ["/feature-album.jpg", "/feature-sns.jpg", "/feature-diary.jpg", "/feature-item.jpg"][index % 4]
      }))
    }
  ];

  return {
    id: `worldline-${Date.now()}`,
    title: String(raw?.title || "存在しないあなたの記録"),
    era: String(input.era),
    place: String(input.place),
    role: String(input.role),
    mood: String(input.mood),
    summary: String(raw?.summary || raw?.diary || "存在しないはずなのに、どこか懐かしい自分史。"),
    album: albumText,
    line: Array.isArray(raw?.line) ? raw.line : [],
    sns: String(raw?.sns || "あの日の帰り道だけ、まだ少し覚えている。 #未読の人生"),
    search,
    diary: String(raw?.diary || "今日は、なぜか少しだけ帰り道が長く感じた。"),
    item: String(raw?.item || "少し色あせたキーホルダー"),
    bgm: String(raw?.bgm || "夏の終わり、駅前ロータリー"),
    characters: characters.map((c: any, index: number) => ({
      id: String(c?.id || `friend-${index + 1}`),
      name: String(c?.name || `友だち${index + 1}`),
      relationship: String(c?.relationship || "友だち"),
      age: String(c?.age || "17"),
      personality: String(c?.personality || "自然で優しい。"),
      speakingStyle: String(c?.speakingStyle || "短めで自然な口調。"),
      backstory: String(c?.backstory || "この世界線で主人公と関わりがある人物。"),
      avatar: String(c?.avatar || String(c?.name || "友").slice(0, 1)),
      avatarUrl: String(c?.avatarUrl || ["/avatar-yui.svg", "/avatar-ren.svg", "/avatar-mika.svg"][index % 3]),
      latestMessage: String(c?.latestMessage || "また話そう"),
      unread: Number(c?.unread || 0)
    })),
    albums
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed", message: "POST only." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "missing_openai_api_key",
      message: "Vercelの環境変数 OPENAI_API_KEY が未設定です。",
    });
  }

  try {
    const { era, place, role, mood } = req.body ?? {};

    if (!era || !place || !role || !mood) {
      return res.status(400).json({
        error: "missing_params",
        message: "時代・場所・立場・雰囲気を入力してください。",
      });
    }

    const rate = getRateStatus(req);
    if (!rate.allowed) {
      return res.status(429).json({
        error: "daily_limit_exceeded",
        message: "本日の無料生成回数は上限に達しました。明日またお試しください。",
        remaining: 0,
        limit: DAILY_LIMIT,
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "-4.1-mini",
      input: `
あなたは「未読の人生」という体験型サービスの生成エンジンです。
ユーザーの設定から、存在しないのに妙に懐かしい“もうひとつの自分史”を日本語で生成してください。

設定:
- 時代: ${era}
- 場所: ${place}
- 立場: ${role}
- 雰囲気: ${mood}

必ずJSONのみで返してください。Markdownや説明文は不要です。

{
  "title": "短い自分史タイトル",
  "summary": "この自分史の短い概要",
  "album": ["写真説明1", "写真説明2", "写真説明3"],
  "line": ["相手: 短い会話", "自分: 短い返信", "相手: 余韻のある一言"],
  "sns": "短いSNS投稿文。ハッシュタグは1つだけ。",
  "search": ["検索履歴1", "検索履歴2", "検索履歴3"],
  "diary": "短い日記",
  "item": "思い出の品",
  "bgm": "架空のBGMタイトル",
  "characters": [
    {
      "id": "半角英数のID",
      "name": "名前",
      "relationship": "関係性",
      "age": "年齢",
      "personality": "性格",
      "speakingStyle": "口調",
      "backstory": "背景設定",
      "avatar": "1文字か2文字",
      "avatarUrl": "/avatar-yui.svg または /avatar-ren.svg または /avatar-mika.svg のいずれか",
      "latestMessage": "最新メッセージ",
      "unread": 1
    }
  ],
  "albums": [
    {
      "id": "半角英数のID",
      "title": "アルバム名",
      "description": "説明",
      "coverUrl": "/feature-album.jpg",
      "photos": [
        {
          "id": "photo-1",
          "title": "写真タイトル",
          "caption": "キャプション",
          "date": "1999.08.15 19:42",
          "imageUrl": "/feature-album.jpg"
        }
      ]
    }
  ]
}
      `,
      temperature: 0.95,
    });

    const raw = extractJson(response.output_text ?? "");
    const result = normalizeResult(raw, { era, place, role, mood });
    const remaining = incrementRateLimit(rate.key, rate.today);

    return res.status(200).json({ result, remaining, limit: DAILY_LIMIT });
  } catch (error: any) {
    console.error("generate_error:", error);
    return res.status(500).json({
      error: "generation_failed",
      message: error?.message || "生成に失敗しました。",
    });
  }
}

