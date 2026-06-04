const https = require("https");

const DAILY_LIMIT = 3;
const store = global.__kakuJibunshiWorldlineStore || new Map();
global.__kakuJibunshiWorldlineStore = store;

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

function jstDateKey() {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function clientKey(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip =
    typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0].trim()
      : req.socket && req.socket.remoteAddress
        ? req.socket.remoteAddress
        : "unknown";

  return `ip:${ip}`;
}

function getRate(req) {
  const today = jstDateKey();
  const key = clientKey(req);
  const current = store.get(key);

  if (!current || current.date !== today) {
    return { key, today, allowed: true, remaining: DAILY_LIMIT };
  }

  return {
    key,
    today,
    allowed: current.count < DAILY_LIMIT,
    remaining: Math.max(DAILY_LIMIT - current.count, 0),
  };
}

function incrementRate(key, today) {
  const current = store.get(key);

  if (!current || current.date !== today) {
    store.set(key, { date: today, count: 1 });
    return DAILY_LIMIT - 1;
  }

  current.count += 1;
  store.set(key, current);

  return Math.max(DAILY_LIMIT - current.count, 0);
}

function postOpenAI(payload, apiKey) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);

    const request = https.request(
      {
        hostname: "api.openai.com",
        path: "/v1/chat/completions",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 30000,
      },
      (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          let json = null;

          try {
            json = data ? JSON.parse(data) : {};
          } catch (error) {
            resolve({
              ok: false,
              status: response.statusCode || 502,
              json: {
                error: {
                  message: data.slice(0, 400) || "OpenAIからJSON以外の応答が返りました。",
                },
              },
            });
            return;
          }

          resolve({
            ok: response.statusCode >= 200 && response.statusCode < 300,
            status: response.statusCode || 500,
            json,
          });
        });
      }
    );

    request.on("timeout", () => {
      request.destroy(new Error("OpenAI APIへの接続がタイムアウトしました。"));
    });

    request.on("error", reject);

    request.write(body);
    request.end();
  });
}

function extractJson(text) {
  const cleaned = String(text || "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");

  if (first === -1 || last === -1) {
    throw new Error("OpenAIの出力からJSONを取得できませんでした。");
  }

  return JSON.parse(cleaned.slice(first, last + 1));
}

function arr(value) {
  if (Array.isArray(value)) return value.map((v) => String(v || "")).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function text(value, fallback) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value)) return value.map((v) => String(v || "")).filter(Boolean).join(" / ");
  return fallback;
}

const avatarUrls = [
  "/avatar-yui.svg",
  "/avatar-ren.svg",
  "/avatar-mika.svg",
  "/avatar-sora.svg",
  "/avatar-aki.svg",
  "/avatar-haru.svg",
  "/avatar-nana.svg",
  "/avatar-daichi.svg",
  "/avatar-riko.svg",
  "/avatar-toma.svg",
  "/avatar-mao.svg",
  "/avatar-shun.svg",
  "/avatar-eri.svg",
];

const fallbackCharacters = [
  ["yui", "ゆい", "同級生", "17", "明るいけれど、ふとした瞬間に寂しさが出る。", "短めで自然。少しだけ絵文字。", "放課後によく一緒に帰る同級生。", "ゆ", "/avatar-yui.svg", "今日、帰り寄り道しよ？", 2],
  ["ren", "蓮", "幼なじみ", "17", "ぶっきらぼうだが面倒見がいい。", "短文で少し雑。照れ隠しが多い。", "小学校からの幼なじみ。", "蓮", "/avatar-ren.svg", "お前、今日なんか変だったぞ", 0],
  ["mika", "美佳", "部活の先輩", "18", "落ち着いていて優しい。", "丁寧だけど親しみがある。", "卒業を控えた部活の先輩。", "美", "/avatar-mika.svg", "あと少しで夏も終わるね", 1],
  ["sora", "空", "隣の席", "17", "無口で観察力がある。", "淡々として短い。", "2学期から隣の席になった。", "空", "/avatar-sora.svg", "今日の空、見た？", 0],
  ["aki", "亜希", "親友", "17", "明るく現実的。恋愛相談に鋭い。", "テンポが早くツッコミ多め。", "購買でよく一緒にパンを買う親友。", "亜", "/avatar-aki.svg", "で、結局どうなったの？", 3],
  ["haru", "春斗", "クラスメイト", "17", "陽気で誰とでも話す。", "軽い冗談を挟む男子っぽい口調。", "文化祭準備で急に仲良くなった。", "春", "/avatar-haru.svg", "文化祭のやつ、まだ残ってる？", 0],
  ["nana", "菜々", "後輩", "16", "人懐っこくて素直。", "丁寧で少し背伸びした口調。", "部活の後輩。主人公に憧れている。", "菜", "/avatar-nana.svg", "先輩、今日少し話せますか？", 1],
  ["daichi", "大地", "バイト仲間", "18", "気さくで面倒見がいい。", "ラフで兄貴っぽい。", "駅前のコンビニで一緒にバイトしている。", "大", "/avatar-daichi.svg", "今日シフト入ってたっけ？", 0],
  ["riko", "莉子", "元同じ塾", "17", "真面目で努力家。", "落ち着いた文章で少し距離がある。", "中学時代に同じ塾だった。", "莉", "/avatar-riko.svg", "久しぶり。元気にしてる？", 0],
  ["toma", "冬馬", "写真部", "17", "感性が強く少し皮肉屋。", "静かで少し文学的。", "写真部で一緒。主人公の横顔を撮っている。", "冬", "/avatar-toma.svg", "昨日の写真、現像できた", 1],
  ["mao", "真央", "従姉妹", "19", "自由でマイペース。", "ゆるく背中を押す。", "夏休みにだけ会う従姉妹。", "真", "/avatar-mao.svg", "その話、なんか青春じゃん", 0],
  ["shun", "俊", "ライバル", "17", "負けず嫌いで素直じゃない。", "短く強め。たまに本音が漏れる。", "成績や部活で比べられる存在。", "俊", "/avatar-shun.svg", "次は負けねえから", 0],
  ["eri", "絵里", "図書室で会う人", "17", "物静かで優しい。", "静かで丁寧。余白のある返事。", "放課後の図書室でよく会う。", "絵", "/avatar-eri.svg", "この前の本、読めた？", 1],
].map((c) => ({
  id: c[0],
  name: c[1],
  relationship: c[2],
  age: c[3],
  personality: c[4],
  speakingStyle: c[5],
  backstory: c[6],
  avatar: c[7],
  avatarUrl: c[8],
  latestMessage: c[9],
  unread: c[10],
}));

function normalizeCharacter(c, index) {
  const fallback = fallbackCharacters[index % fallbackCharacters.length];

  return {
    id: text(c && c.id, fallback.id),
    name: text(c && c.name, fallback.name),
    relationship: text(c && c.relationship, fallback.relationship),
    age: text(c && c.age, fallback.age),
    personality: text(c && c.personality, fallback.personality),
    speakingStyle: text(c && c.speakingStyle, fallback.speakingStyle),
    backstory: text(c && c.backstory, fallback.backstory),
    avatar: text(c && c.avatar, fallback.avatar),
    avatarUrl: text(c && c.avatarUrl, avatarUrls[index % avatarUrls.length]),
    latestMessage: text(c && c.latestMessage, fallback.latestMessage),
    unread: Number(c && typeof c.unread !== "undefined" ? c.unread : fallback.unread) || 0,
  };
}

function normalizeResult(raw, input) {
  const albumText = arr(raw && raw.album);
  const search = arr(raw && raw.search);
  const rawSnsPosts = Array.isArray(raw && raw.snsPosts) ? raw.snsPosts : [];
  const rawCharacters = Array.isArray(raw && raw.characters) ? raw.characters : [];
  const characters = Array.from({ length: 13 }).map((_, index) =>
    normalizeCharacter(rawCharacters[index], index)
  );

  const rawAlbums = Array.isArray(raw && raw.albums) ? raw.albums : [];
  const albums = rawAlbums.length
    ? rawAlbums.map((album, albumIndex) => ({
        id: text(album && album.id, `album-${albumIndex + 1}`),
        title: text(album && album.title, albumIndex === 0 ? "夏の終わり" : "記録"),
        description: text(album && album.description, "あなたの設定から生まれた架空アルバム。"),
        coverUrl: text(album && album.coverUrl, "/feature-album.jpg"),
        photos: Array.isArray(album && album.photos)
          ? album.photos.map((photo, photoIndex) => ({
              id: text(photo && photo.id, `photo-${albumIndex + 1}-${photoIndex + 1}`),
              title: text(photo && photo.title, `記録 ${photoIndex + 1}`),
              caption: text(photo && photo.caption, albumText[photoIndex] || "まだ言葉にならない記録。"),
              date: text(photo && photo.date, String(input.era)),
              imageUrl: text(photo && photo.imageUrl, ["/feature-album.jpg", "/feature-sns.jpg", "/feature-diary.jpg", "/feature-item.jpg"][photoIndex % 4]),
            }))
          : [],
      }))
    : [
        {
          id: "generated-album",
          title: "生成された記録",
          description: "あなたの設定から生まれた架空アルバム。",
          coverUrl: "/feature-album.jpg",
          photos: albumText.slice(0, 4).map((caption, index) => ({
            id: `photo-${index + 1}`,
            title: `記録 ${index + 1}`,
            caption,
            date: String(input.era),
            imageUrl: ["/feature-album.jpg", "/feature-sns.jpg", "/feature-diary.jpg", "/feature-item.jpg"][index % 4],
          })),
        },
      ];


  const snsPosts = rawSnsPosts.length
    ? rawSnsPosts.slice(0, 12).map((post, index) => {
        const character = characters[index % characters.length];

        return {
          id: text(post && post.id, `sns-${index + 1}`),
          userName: text(post && post.userName, `${character.id}_log`),
          displayName: text(post && post.displayName, character.name),
          avatarUrl: text(post && post.avatarUrl, character.avatarUrl),
          content: text(post && post.content, "今日は、なぜか帰り道が少し長く感じた。"),
          imageUrl: text(post && post.imageUrl, ["/feature-sns.jpg", "/feature-album.jpg", "/feature-diary.jpg", "/feature-item.jpg"][index % 4]),
          likes: Number(post && post.likes) || 20 + index * 11,
          comments: arr(post && post.comments).slice(0, 4),
          postedAt: text(post && post.postedAt, String(input.era)),
          location: text(post && post.location, String(input.place)),
        };
      })
    : characters.slice(0, 8).map((character, index) => ({
        id: `sns-${index + 1}`,
        userName: `${character.id}_log`,
        displayName: character.name,
        avatarUrl: character.avatarUrl,
        content: [
          `${input.place}の帰り道、今日はなんか少しだけ静かだった。`,
          `${input.role}って、思ってたより忙しい。けど今日の空はよかった。`,
          `明日も同じ道を通るのに、今日だけ覚えておきたい感じがする。`,
          `${input.mood}日って、あとから急に思い出すんだろうな。`,
        ][index % 4],
        imageUrl: ["/feature-sns.jpg", "/feature-album.jpg", "/feature-diary.jpg", "/feature-item.jpg"][index % 4],
        likes: 40 + index * 17,
        comments: ["わかる", "それどこ？", "今日の雰囲気よかった"],
        postedAt: String(input.era),
        location: String(input.place),
      }));


  return {
    id: `worldline-${Date.now()}`,
    title: text(raw && raw.title, "存在しないあなたの記録"),
    era: String(input.era),
    place: String(input.place),
    role: String(input.role),
    mood: String(input.mood),
    summary: text(raw && raw.summary, "存在しないはずなのに、どこか懐かしい自分史。"),
    album: albumText,
    line: arr(raw && raw.line),
    sns: text(raw && raw.sns, "あの日の帰り道だけ、まだ少し覚えている。 #未読の人生"),
    snsPosts,
    search,
    diary: text(raw && raw.diary, "今日は、なぜか少しだけ帰り道が長く感じた。"),
    item: text(raw && raw.item, "少し色あせたキーホルダー"),
    bgm: text(raw && raw.bgm, "夏の終わり、駅前ロータリー"),
    characters,
    albums,
  };
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
    const { era, place, role, mood } = body || {};

    if (!era || !place || !role || !mood) {
      return sendJson(res, 400, {
        error: "missing_params",
        message: "時代・場所・立場・雰囲気を入力してください。",
      });
    }

    const rate = getRate(req);

    if (!rate.allowed) {
      return sendJson(res, 429, {
        error: "daily_limit_exceeded",
        message: "本日の無料生成回数は上限に達しました。明日またお試しください。",
        remaining: 0,
        limit: DAILY_LIMIT,
      });
    }

    const prompt = `
あなたは「未読の人生」という体験型サービスの生成エンジンです。
ユーザーの設定から、存在しないのに妙に懐かしい“もうひとつの自分史”を日本語で生成してください。

設定:
- 時代: ${era}
- 場所: ${place}
- 立場: ${role}
- 雰囲気: ${mood}

必ずJSONのみで返してください。Markdownや説明文は不要です。
charactersは必ず13人作成してください。
snsPostsは必ず8〜12件作成してください。投稿者はcharactersの人物を中心にし、時代・場所・立場・雰囲気に合う投稿内容にしてください。
恋愛相手・親友・幼なじみ・先輩・後輩・バイト仲間・ライバル・静かな友人など、関係性と口調を必ず分けてください。

{
  "title": "短い自分史タイトル",
  "summary": "この自分史の短い概要",
  "album": ["写真説明1", "写真説明2", "写真説明3"],
  "line": ["相手: 短い会話", "自分: 短い返信", "相手: 余韻のある一言"],
  "sns": "短いSNS投稿文。ハッシュタグは1つだけ。",
  "snsPosts": [
    {
      "id": "sns-1",
      "userName": "投稿者ID",
      "displayName": "投稿者名",
      "avatarUrl": "/avatar-yui.svg",
      "content": "世界線に合った投稿本文",
      "imageUrl": "/feature-sns.jpg",
      "likes": 132,
      "comments": ["短いコメント1", "短いコメント2"],
      "postedAt": "1999.08.15 19:42",
      "location": "場所"
    }
  ],
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
      "avatarUrl": "/avatar-yui.svg /avatar-ren.svg /avatar-mika.svg /avatar-sora.svg /avatar-aki.svg /avatar-haru.svg /avatar-nana.svg /avatar-daichi.svg /avatar-riko.svg /avatar-toma.svg /avatar-mao.svg /avatar-shun.svg /avatar-eri.svg のいずれか",
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
`;

    const openai = await postOpenAI(
      {
        model: process.env.OPENAI_CREATE_MODEL || process.env.OPENAI_MODEL || "-4o-mini",
        temperature: 0.95,
        max_tokens: 2600,
        messages: [
          {
            role: "system",
            content: "あなたはJSONだけを返す日本語の体験生成エンジンです。",
          },
          {
            role: "user",
            content: prompt,
          },
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

    const content =
      openai.json &&
      openai.json.choices &&
      openai.json.choices[0] &&
      openai.json.choices[0].message &&
      openai.json.choices[0].message.content
        ? openai.json.choices[0].message.content
        : "";

    const raw = extractJson(content);
    const result = normalizeResult(raw, { era, place, role, mood });
    const remaining = incrementRate(rate.key, rate.today);

    return sendJson(res, 200, {
      result,
      remaining,
      limit: DAILY_LIMIT,
    });
  } catch (error) {
    console.error("worldline_create_error:", error);

    return sendJson(res, 500, {
      error: "worldline_create_failed",
      message: error && error.message ? error.message : "世界線の生成に失敗しました。",
    });
  }
};

