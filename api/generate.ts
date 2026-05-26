import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { era, place, role, mood } = req.body;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
あなたは「あったかもしれない」という体験型サービスの生成エンジンです。
以下の設定から、存在しなかった“もうひとつの人生”を生成してください。

時代: ${era}
場所: ${place}
立場: ${role}
雰囲気: ${mood}

必ずJSONのみで返してください。Markdownや説明文は不要です。
{
  "title": "",
  "album": ["", "", ""],
  "line": ["", "", ""],
  "sns": "",
  "search": ["", "", ""],
  "diary": "",
  "item": "",
  "bgm": ""
}
      `,
    });

    return res.status(200).json({
      result: response.output_text,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "generation_failed" });
  }
}
