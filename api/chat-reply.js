const https = require("https");

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === "object") {
      resolve(req.body);
      return;
    }

    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error("リクエストJSONの解析に失敗しました。"));
      }
    });
    req.on("error", reject);
  });
}

function postToOpenAI(payload, apiKey) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);

    const req = https.request(
      {
        hostname: "api.openai.com",
        path: "/v1/chat/completions",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 25000,
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          let json = null;

          try {
            json = data ? JSON.parse(data) : {};
          } catch (error) {
            resolve({
              ok: false,
              status: res.statusCode || 502,
              json: {
                error: {
                  message: data.slice(0, 300) || "OpenAIからJSON以外の応答が返りました。",
                },
              },
            });
            return;
          }

          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode || 500,
            json,
          });
        });
      }
    );

    req.on("timeout", () => {
      req.destroy(new Error("OpenAI APIへの接続がタイムアウトしました。"));
    });

    req.on("error", reject);

    req.write(body);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, {
      error: "method_not_allowed",
      message: "POST only.",
    });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return sendJson(res, 500, {
        error: "missing_openai_api_key",
        message: "Vercelの環境変数 OPENAI_API_KEY が未設定です。",
      });
    }

    const body = await readBody(req);
    const { worldline, character, history, message } = body || {};

    if (!worldline || !character || !message) {
      return sendJson(res, 400, {
        error: "missing_params",
        message: "worldline / character / message が不足しています。",
      });
    }

    const compactHistory = Array.isArray(history)
      ? history.slice(-10).map((m) => ({
          role: m && m.role === "assistant" ? "assistant" : "user",
          content: String((m && (m.text || m.content)) || ""),
        }))
      : [];

    const systemPrompt = `
あなたは「もしもログ」というアプリ内に存在するキャラクターです。
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
- 基本は1〜2文。長くても3文まで
- 説明くさくしない
- すぐに結論を言いすぎない
- 毎回質問で返さない
- 相手の入力を少し受け止めてから、自分の感情や記憶を一言だけ足す
- 口調・距離感・照れ・遠慮・冗談はキャラクター設定に合わせる
- AI、OpenAI、アプリ、生成という言葉は出さない
- その人の性格と関係性を守る
- 時代設定に合わない言葉は避ける
- たまに既読後に少し間を置いたような余白のある返事にする
`;

    const openai = await postToOpenAI(
      {
        model: process.env.OPENAI_CHAT_MODEL || process.env.OPENAI_MODEL || "-4o-mini",
        temperature: 0.9,
        max_tokens: 180,
        messages: [
          { role: "system", content: systemPrompt },
          ...compactHistory,
          { role: "user", content: String(message) },
        ],
      },
      apiKey
    );

    if (!openai.ok) {
      return sendJson(res, openai.status || 500, {
        error: (openai.json && openai.json.error && (openai.json.error.code || openai.json.error.type)) || "openai_error",
        message: (openai.json && openai.json.error && openai.json.error.message) || "OpenAI APIでエラーが発生しました。",
      });
    }

    const reply =
      openai.json &&
      openai.json.choices &&
      openai.json.choices[0] &&
      openai.json.choices[0].message &&
      openai.json.choices[0].message.content
        ? String(openai.json.choices[0].message.content).trim()
        : "";

    return sendJson(res, 200, {
      reply: reply || "うん、なんか少しだけわかる気がする。",
    });
  } catch (error) {
    console.error("chat_reply_error:", error);

    return sendJson(res, 500, {
      error: "chat_reply_failed",
      message: error && error.message ? error.message : "返信の生成に失敗しました。",
    });
  }
};

