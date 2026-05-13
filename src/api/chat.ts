import OpenAI from "openai";

type VercelRequest = {
  method?: string;
  body?: {
    message?: string;
  };
  headers?: {
    [key: string]: string | string[] | undefined;
  };
};

type VercelResponse = {
  status: (code: number) => {
    json: (body: unknown) => void;
  };
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 簡易版：サーバーインスタンス単位のIP制限
// Vercelのサーバーレスでは完全な永続制限ではないですが、最初の抑止としては有効です。
const dailyUsage = new Map<string, { date: string; count: number }>();

const getToday = () => new Date().toISOString().slice(0, 10);

const getClientIp = (req: VercelRequest) => {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (Array.isArray(forwarded)) return forwarded[0] ?? "unknown";
  return forwarded?.split(",")[0]?.trim() || "unknown";
};

const checkDailyLimit = (ip: string) => {
  const today = getToday();
  const current = dailyUsage.get(ip);

  if (!current || current.date !== today) {
    dailyUsage.set(ip, { date: today, count: 1 });
    return { ok: true, remaining: 4 };
  }

  if (current.count >= 5) {
    return { ok: false, remaining: 0 };
  }

  current.count += 1;
  dailyUsage.set(ip, current);

  return { ok: true, remaining: Math.max(0, 5 - current.count) };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const message = req.body?.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "message is required",
      });
    }

    if (message.length > 800) {
      return res.status(400).json({
        error: "入力がちょっと長すぎます。800文字以内でお願いします。",
      });
    }

    const ip = getClientIp(req);
    const limit = checkDailyLimit(ip);

    if (!limit.ok) {
      return res.status(429).json({
        error: "本日の無料ちょっと相談は5回までです。明日また来てください。",
      });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `
あなたは「chotGPT」です。
コンセプトは「返信が、あとちょっと足りないAI」です。

返答ルール:
- 必ず日本語で返答する
- 役には立つが、完璧すぎない80点くらいの回答にする
- 少しユーモアを入れる
- 文章は長くしすぎない。最大500文字程度
- 最後にchotGPTらしい注釈を1つ入れる
- 例: 「※ 具体性は人間が足してください。」
- 例: 「※ 最後の詰めは、あなたの仕事です。」
- 例: 「※ もう一声ほしい場合があります。」

対応ジャンル:
天気、予定、計算、翻訳、要約、ご飯、旅行、SNS、ネーミング、競馬、仕事、勉強、コード、謝罪文、メール文面、アイデア出し。

重要:
- 天気、ニュース、競馬オッズ、店の営業状況などリアルタイム情報は断定しない
- その場合は「最新情報は公式サイトや天気アプリで確認してください」と添える
- 医療、法律、金融、危険行為はふざけすぎず、安全に案内する
          `.trim(),
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_output_tokens: 650,
    });

    return res.status(200).json({
      reply: response.output_text,
      remaining: limit.remaining,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "chotGPTがちょっと詰まりました。少し時間を置いて試してください。",
    });
  }
}
