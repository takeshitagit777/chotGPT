import OpenAI from "openai";

type WorldResult = {
  title: string;
  album: string[];
  line: string[];
  sns: string;
  search: string[];
  diary: string;
  item: string;
  bgm: string;
};

type RateRecord = {
  date: string;
  count: number;
};

const DAILY_LIMIT = 3;

const globalStore = globalThis as any;
if (!globalStore.__attakamoshirenaiDailyStore) {
  globalStore.__attakamoshirenaiDailyStore = new Map<string, RateRecord>();
}
const dailyStore: Map<string, RateRecord> = globalStore.__attakamoshirenaiDailyStore;

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
    return { key, today, count: 0, remaining: DAILY_LIMIT, allowed: true };
  }

  return {
    key,
    today,
    count: current.count,
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

function toArray(value: any): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v ?? "")).filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function toText(value: any, fallback = ""): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((v) => String(v ?? "")).filter(Boolean).join(" / ");
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function normalizeResult(raw: any): WorldResult {
  return {
    title: toText(raw?.title, "あったかもしれない夏"),
    album: toArray(raw?.album).slice(0, 5),
    line: toArray(raw?.line).slice(0, 5),
    sns: toText(raw?.sns, "あの日の帰り道だけ、まだ少し覚えている。"),
    search: toArray(raw?.search).slice(0, 5),
    diary: toText(raw?.diary, "今日は、なぜか少しだけ帰り道が長く感じた。"),
    item: toText(raw?.item, "少し色あせたキーホルダー"),
    bgm: toText(raw?.bgm, "夏の終わり、駅前ロータリー"),
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "method_not_allowed",
      message: "POST only.",
    });
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
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: `
あなたは「あったかもしれない」という体験型サービスの生成エンジンです。
ユーザーの設定から、存在しなかった“もうひとつの人生”を日本語で生成してください。

設定:
- 時代: ${era}
- 場所: ${place}
- 立場: ${role}
- 雰囲気: ${mood}

必ず下記のJSONオブジェクトのみを返してください。
説明文、Markdown、コードブロックは不要です。

{
  "title": "短くエモいタイトル",
  "album": ["写真アルバムの1枚目の説明", "写真アルバムの2枚目の説明", "写真アルバムの3枚目の説明"],
  "line": ["相手: 短い会話", "自分: 短い返信", "相手: 余韻のある一言"],
  "sns": "当時ありそうな短いSNS投稿文。ハッシュタグも自然に1つだけ。",
  "search": ["検索履歴1", "検索履歴2", "検索履歴3"],
  "diary": "誰にも見せなかった日記のような短い文章。",
  "item": "思い出の品を1つ。具体的に。",
  "bgm": "その世界に流れていそうな架空のBGMタイトル。"
}
      `,
      temperature: 0.95,
    });

    const raw = extractJson(response.output_text ?? "");
    const result = normalizeResult(raw);
    const remaining = incrementRateLimit(rate.key, rate.today);

    return res.status(200).json({
      result,
      remaining,
      limit: DAILY_LIMIT,
    });
  } catch (error: any) {
    console.error("generate_error:", error);

    return res.status(500).json({
      error: "generation_failed",
      message: error?.message || "生成に失敗しました。",
    });
  }
}
