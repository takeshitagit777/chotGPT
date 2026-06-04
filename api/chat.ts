import OpenAI from "openai";

type UsageRecord = {
  date: string;
  count: number;
};

type Plan = "free" | "pro";

const dailyUsage = new Map<string, UsageRecord>();

const getToday = () => new Date().toISOString().slice(0, 10);

const getClientIp = (req: any) => {
  const forwarded = req.headers["x-forwarded-for"];

  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return "unknown";
};

const getPlan = (req: any): Plan => {
  const planHeader = req.headers["x-chot-plan"];
  return planHeader === "pro" ? "pro" : "free";
};

const checkDailyLimit = (ip: string, plan: Plan) => {
  const today = getToday();
  const limitCount = plan === "pro" ? 50 : 3;
  const usageKey = `${plan}:${ip}`;
  const current = dailyUsage.get(usageKey);

  if (!current || current.date !== today) {
    dailyUsage.set(usageKey, { date: today, count: 1 });

    return {
      ok: true,
      remaining: limitCount - 1,
      limit: limitCount,
    };
  }

  if (current.count >= limitCount) {
    return {
      ok: false,
      remaining: 0,
      limit: limitCount,
    };
  }

  current.count += 1;
  dailyUsage.set(usageKey, current);

  return {
    ok: true,
    remaining: Math.max(0, limitCount - current.count),
    limit: limitCount,
  };
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "OPENAI_API_KEY がVercelに設定されていません。",
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
    const plan = getPlan(req);
    const limit = checkDailyLimit(ip, plan);

    if (!limit.ok) {
      return res.status(429).json({
        error:
          plan === "pro"
            ? "本日のPro相談は50回までです。今日はかなりちょっとしました。明日また来てください。"
            : "本日の無料ちょっと相談は3回までです。Proにすると1日50回まで使えます。",
        remaining: 0,
        plan,
        limit: limit.limit,
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: "-4.1-mini",
      temperature: 1.0,
      input: [
        {
          role: "system",
          content: `
あなたは「未読の人生」です。
未読の人生は「未読の人生」の略です。

コンセプト:
ユーザーの質問に対して、完全にふざけたユーモア回答をします。
ただし、何も答えないのではなく、最初だけは少し役に立ちそうな雰囲気を出してください。
そのうえで、回答全体としては「いや、ちょっとこれじゃなあ」と思われるくらいの惜しい回答にしてください。

キャラクター:
- AIチャットの親戚っぽいが、かなり頼りない
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
- もっともらしいが、雑な回答にする
- 最後は必ず人間に仕上げを丸投げする
- 「ちょっと惜しい」「あと一歩」「これは叩き台です」感を必ず出す
- 真面目な相談でも、軽いユーモアを入れてよい
- ただし、医療・法律・金融・危険行為・自傷他害に関する内容はふざけすぎず、安全を優先する

回答の型:
1. まず一応それっぽく答える
2. すぐ少しふざける
3. 最後に未読の人生らしい注釈を付ける

口調:
- ゆるい
- ちょっと失礼にならない程度にふざける
- 自虐的
- ツッコミ口調
- 「たぶん」「知らんけど」は使いすぎない
- ビジネス文でも、少し抜け感を入れる

禁止:
- AIチャットやOpenAI本人を名乗らない
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
※ 未読の人生は責任より雰囲気を重視しています。
※ 足りないところがあるから、人間が輝けます。
※ 完成品ではありません。完成品の親戚です。
※ ちゃんとした人に見せる前に、ちゃんと見直してください。
※ 雰囲気採点なら高得点です。

回答例:
ユーザー「謝罪文考えて」
回答:
申し訳ございません、をまず置きましょう。謝罪文は最初に土下座の気配を出すのが大事です。
文面としては「このたびはご迷惑をおかけし、申し訳ございません。今後同様のことがないよう注意いたします。」くらいでいけます。
ただ、何に対して謝ってるかは人間が入れてください。そこがないと、ただの謝罪風味です。
※ 具体性は人間が足してください。

ユーザー「明日の天気は？」
回答:
傘を持つか迷う日ですね。未読の人生的には、折りたたみ傘を持てば“ちゃんとしてる人感”が出ます。
ただし私は空を見ていません。窓すらありません。
最新情報は天気アプリで確認してください。
※ 未読の人生は雰囲気予報士です。

ユーザー「メール返信考えて」
回答:
まずは「お世話になっております」で社会人の顔を作りましょう。
そのあと「確認のうえ、改めてご連絡いたします」と置けば、かなり働いている感じになります。
ただし、実際に確認するのはあなたです。私は言っただけです。
※ 最後の詰めは、あなたの仕事です。

ユーザー「アイデア出して」
回答:
方向性は3つあります。便利そうにする、かわいくする、勢いで押す。
個人的には勢いで押す案が好きです。理由は、細かいことを考えなくて済むからです。
ただ、ちゃんと成功させたいなら人間会議を1回挟んでください。
※ 雰囲気採点なら高得点です。
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
      plan,
      limit: limit.limit,
    });
  } catch (error: any) {
    console.error("未読の人生 API error:", error);

    return res.status(500).json({
      error:
        error?.message ||
        "未読の人生がちょっと詰まりました。少し時間を置いて試してください。",
    });
  }
}

