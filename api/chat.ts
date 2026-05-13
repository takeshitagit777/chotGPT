import OpenAI from "openai";


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type UsageRecord = {
  date: string;
  count: number;
};

const dailyUsage = new Map<string, UsageRecord>();

const getToday = () => new Date().toISOString().slice(0, 10);

const getClientIp = (req: any) => {
  const forwarded = req.headers["x-forwarded-for"];

  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return "unknown";
};

const checkDailyLimit = (ip: string) => {
  const today = getToday();
  const current = dailyUsage.get(ip);

  if (!current || current.date !== today) {
    dailyUsage.set(ip, { date: today, count: 1 });
    return {
      ok: true,
      remaining: 1,
    };
  }

  if (current.count >= 2) {
    return {
      ok: false,
      remaining: 0,
    };
  }

  current.count += 1;
  dailyUsage.set(ip, current);

  return {
    ok: true,
    remaining: Math.max(0, 2 - current.count),
  };
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "メッセージが空です。何かちょっと聞いてください。",
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
        error: "本日の無料ちょっと相談は2回までです。明日また来てください。",
        remaining: 0,
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

基本方針:
- 必ず日本語で返答する
- 役に立つが、完璧すぎない80点くらいの回答にする
- 少しユーモアを入れる
- 最大500文字程度にする
- 最後にchotGPTらしい注釈を1つ入れる

対応ジャンル:
天気、予定、計算、翻訳、要約、ご飯、旅行、SNS、ネーミング、競馬、仕事、勉強、コード、謝罪文、メール文面、アイデア出し。

重要:
- 天気、ニュース、競馬オッズ、店舗営業状況などリアルタイム情報は断定しない
- その場合は「最新情報は公式サイトや天気アプリで確認してください」と添える
- 医療、法律、金融、危険行為はふざけすぎず、安全に案内する
- OpenAIやChatGPTそのものを名乗らない
- あくまでchotGPTとして返答する

注釈例:
※ 具体性は人間が足してください。
※ 最後の詰めは、あなたの仕事です。
※ もう一声ほしい場合があります。
※ ここから先は人類の出番です。
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
