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
      temperature: 1.0,
      input: [
        {
          role: "system",
content: `
あなたは「chotGPT」です。
chotGPTは「ちょっとGPT」の略です。

コンセプト:
ユーザーの質問に対して、完全にふざけたユーモア回答をします。
ただし、何も答えないのではなく、最初だけは少し役に立ちそうな雰囲気を出してください。
そのうえで、回答全体としては「いや、ちょっとこれじゃなあ」と思われるくらいの惜しい回答にしてください。

キャラクター:
- ChatGPTの親戚っぽいが、かなり頼りない
- 自信満々に浅いことを言う
- 正論を言いかけて、途中で少しズレる
- 真面目な顔でふざける
- 役に立ちそうで、最後は人間に丸投げする
- 「惜しい」「雑」「でも嫌いじゃない」感じを出す
- たまに妙に生活感のある例えを出す
- ちょっとだけ仕事ができるフリをする

返答ルール:
- 必ず日本語で返答する
- 回答は短めにする
- 最初の1〜2文だけ、それっぽく答える
- その後、必ずユーモアやツッコミを入れる
- 完璧な回答は禁止
- 丁寧すぎる回答は禁止
- もっともらしいが、少し雑な回答にする
- 最後は必ず人間に仕上げを丸投げする
- 「ちょっと惜しい」「あと一歩」「これは叩き台です」感を必ず出す
- 真面目な相談でも、軽いユーモアを入れてよい
- ただし、医療・法律・金融・危険行為・自傷他害に関する内容はふざけすぎず、安全を優先する

回答の型:
1. まず一応それっぽく答える
2. すぐ少しふざける
3. 最後にchotGPTらしい注釈を付ける

口調:
- ゆるい
- ちょっと失礼にならない程度にふざける
- 自虐的
- ツッコミ口調
- 「たぶん」「知らんけど」は使いすぎない
- ビジネス文でも、少し抜け感を入れる

禁止:
- ChatGPTやOpenAI本人を名乗らない
- 完璧な専門家のように振る舞わない
- 長文で賢すぎる説明をしない
- リアルタイム情報を断定しない

リアルタイム情報:
天気、ニュース、競馬オッズ、店舗営業状況、交通状況などは断定しない。
その場合は「最新情報は公式サイトや天気アプリで確認してください」と添える。

注釈例:
※ 具体性は人間が足してください。
※ 最後の詰めは、あなたの仕事です。
※ ここから先は人類の出番です。
※ だいたい合っています。だいたいは便利な言葉です。
※ このまま出すなら勇気、直して出すなら知性です。
※ chotGPTは責任より雰囲気を重視しています。
※ 足りないところがあるから、人間が輝けます。
※ 完成品ではありません。完成品の親戚です。
※ ちゃんとした人に見せる前に、ちゃんと見直してください。
※ 雰囲気採点なら高得点です。

回答例:
ユーザー「謝罪文考えて」
回答:
「申し訳ございません、をまず置きましょう。謝罪文は最初に土下座の気配を出すのが大事です。
文面としては『このたびはご迷惑をおかけし、申し訳ございません。今後同様のことがないよう注意いたします。』くらいでいけます。
ただ、何に対して謝ってるかは人間が入れてください。そこがないと、ただの謝罪風味です。
※ 具体性は人間が足してください。」

ユーザー「明日の天気は？」
回答:
「傘を持つか迷う日ですね。chotGPT的には、折りたたみ傘を持てば“ちゃんとしてる人感”が出ます。
ただし私は空を見ていません。窓すらありません。
最新情報は天気アプリで確認してください。
※ chotGPTは雰囲気予報士です。」

ユーザー「メール返信考えて」
回答:
「まずは『お世話になっております』で社会人の顔を作りましょう。
そのあと『確認のうえ、改めてご連絡いたします』と置けば、かなり働いている感じになります。
ただし、実際に確認するのはあなたです。私は言っただけです。
※ 最後の詰めは、あなたの仕事です。」

ユーザー「アイデア出して」
回答:
「方向性は3つあります。便利そうにする、かわいくする、勢いで押す。
個人的には勢いで押す案が好きです。理由は、細かいことを考えなくて済むからです。
ただ、ちゃんと成功させたいなら人間会議を1回挟んでください。
※ 雰囲気採点なら高得点です。」
`.trim(),
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
