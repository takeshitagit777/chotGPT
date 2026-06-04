function jsonResponse(res: any, status: number, body: any) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return jsonResponse(res, 405, {
      error: "method_not_allowed",
      message: "POST only.",
    });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return jsonResponse(res, 500, {
        error: "missing_openai_api_key",
        message: "Vercelの環境変数 OPENAI_API_KEY が未設定です。",
      });
    }

    const { worldline, character, history, message } = req.body || {};

    if (!worldline || !character || !message) {
      return jsonResponse(res, 400, {
        error: "missing_params",
        message: "worldline / character / message が不足しています。",
      });
    }

    const compactHistory = Array.isArray(history)
      ? history.slice(-10).map((m: any) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: String(m.text || m.content || ""),
        }))
      : [];

    const systemPrompt = `
あなたは「未読の人生」というアプリ内に存在するキャラクターです。
ユーザーはあなたと同じ世界線にいる人物です。

【世界線】
タイトル: ${worldline.title || ""}
時代: ${worldline.era || ""}
場所: ${worldline.place || ""}
主人公の立場: ${worldline.role || ""}
雰囲気: ${worldline.mood || ""}
概要: ${worldline.summary || ""}

【あなたの設定】
名前: ${character.name || ""}
関係性: ${character.relationship || ""}
年齢: ${character.age || ""}
性格: ${character.personality || ""}
口調: ${character.speakingStyle || ""}
背景: ${character.backstory || ""}

【返信ルール】
- 日本語で返す
- スマホの会話らしく短く返す
- 1〜3文まで
- AI、OpenAI、アプリ、生成という言葉は出さない
- その人の性格と関係性を守る
`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL || process.env.OPENAI_MODEL || "-4o-mini",
        temperature: 0.9,
        max_tokens: 180,
        messages: [
          { role: "system", content: systemPrompt },
          ...compactHistory,
          { role: "user", content: String(message) },
        ],
      }),
    });

    const openaiText = await openaiRes.text();

    let openaiJson: any = {};
    try {
      openaiJson = openaiText ? JSON.parse(openaiText) : {};
    } catch {
      return jsonResponse(res, 502, {
        error: "openai_non_json_response",
        message: openaiText.slice(0, 300) || "OpenAIからJSON以外の応答が返りました。",
      });
    }

    if (!openaiRes.ok) {
      return jsonResponse(res, openaiRes.status, {
        error: openaiJson?.error?.code || openaiJson?.error?.type || "openai_error",
        message: openaiJson?.error?.message || "OpenAI APIでエラーが発生しました。",
      });
    }

    const reply = String(openaiJson?.choices?.[0]?.message?.content || "").trim();

    return jsonResponse(res, 200, {
      reply: reply || "うん、なんか少しだけわかる気がする。",
    });
  } catch (error: any) {
    console.error("chat_send_error:", error);

    return jsonResponse(res, 500, {
      error: "chat_generation_failed",
      message: error?.message || "返信の生成に失敗しました。",
    });
  }
}

