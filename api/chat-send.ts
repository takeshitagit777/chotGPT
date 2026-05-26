import OpenAI from "openai";

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
    const { worldline, character, history, message } = req.body ?? {};

    if (!worldline || !character || !message) {
      return res.status(400).json({
        error: "missing_params",
        message: "worldline / character / message が不足しています。",
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const compactHistory = Array.isArray(history)
      ? history.slice(-12).map((m: any) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: String(m.text || "")
        }))
      : [];

    const systemPrompt = `
あなたは「架空自分史」というアプリ内に存在するキャラクターです。
ユーザーはあなたと同じ世界線にいる人物です。
以下の設定を守って、自然な会話として返信してください。

【世界線】
タイトル: ${worldline.title}
時代: ${worldline.era}
場所: ${worldline.place}
主人公の立場: ${worldline.role}
雰囲気: ${worldline.mood}
概要: ${worldline.summary}

【あなたの設定】
名前: ${character.name}
関係性: ${character.relationship}
年齢: ${character.age}
性格: ${character.personality}
口調: ${character.speakingStyle}
背景: ${character.backstory}

【返信ルール】
- 返信は日本語
- スマホの会話らしく短め
- 1〜3文まで
- 自然な口調
- 説明くさくしない
- AI、OpenAI、アプリ、生成という言葉は出さない
- 相手との関係性を大切にする
- 時代設定に合わない言葉は避ける
- たまに少しだけ感情がにじむ
`;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        { role: "system", content: systemPrompt },
        ...compactHistory,
        { role: "user", content: String(message) }
      ],
      temperature: 0.9,
    });

    const reply = (response.output_text || "").trim();

    return res.status(200).json({
      reply: reply || "うん、なんか少しだけわかる気がする。",
    });
  } catch (error: any) {
    console.error("chat_send_error:", error);
    return res.status(500).json({
      error: "chat_generation_failed",
      message: error?.message || "返信の生成に失敗しました。",
    });
  }
}
