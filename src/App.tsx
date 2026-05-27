import { useEffect, useMemo, useState } from 'react';

type Character = {
  id: string;
  name: string;
  relationship: string;
  age: string;
  personality: string;
  speakingStyle: string;
  backstory: string;
  avatar: string;
  avatarUrl?: string;
  latestMessage: string;
  unread?: number;
};

type Photo = {
  id: string;
  title: string;
  caption: string;
  date: string;
  imageUrl: string;
};

type Album = {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  photos: Photo[];
};

type SnsPost = {
  id: string;
  userName: string;
  displayName: string;
  avatarUrl: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: string[];
  postedAt: string;
  location?: string;
};

type Worldline = {
  id: string;
  title: string;
  era: string;
  place: string;
  role: string;
  mood: string;
  summary: string;
  album: string[];
  line: string[];
  sns: string;
  snsPosts: SnsPost[];
  search: string[];
  diary: string;
  item: string;
  bgm: string;
  characters: Character[];
  albums: Album[];
};

type ChatMessage = {
  id: string;
  friendId: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
};

const defaultWorldline: Worldline = {
  id: 'default-worldline',
  title: '1999年、夏の終わり',
  era: '1999年',
  place: '地方の海辺の町',
  role: '高校2年生',
  mood: '切なくて懐かしい',
  summary: '存在しないはずなのに、どこか自分の記憶のように感じる夏の自分史。',
  album: [
    '放課後の教室。窓の外だけがやけに明るかった。',
    '夏祭りの帰り道。話したいことを半分だけ残した。',
    '駅前のコンビニ。アイスの袋が少し溶けていた。',
  ],
  line: [
    '相手: ねえ、今日帰り寄り道しよ？',
    '自分: いいよ、いつもの駅で待ってる',
    '相手: なんか今日、忘れたくない日になりそう',
  ],
  sns: '夏の終わりって、なんで少しだけ静かなんだろう。 #架空自分史',
  search: ['好きな人 脈あり サイン', '夏祭り 帰り道 告白', '写真 現像 安い'],
  diary: '今日は楽しかった。でも、楽しいだけじゃなかった。帰り道、少しだけ言葉が足りなかった気がする。',
  item: '制服のポケットに入れたままの、少し折れた映画の半券。',
  bgm: '夕立のあと、駅前ロータリー',
  characters: [
    {
      id: 'yui',
      name: 'ゆい',
      relationship: '同級生',
      age: '17',
      personality: '明るいけれど、ふとした瞬間に寂しさが出る。相手の変化に敏感で、言葉にしない気持ちを察する。',
      speakingStyle: '短めで自然。少しだけ絵文字を使う。距離感は近いが、踏み込みすぎない。語尾はやわらかい。',
      backstory: '海の近くの町で育った。主人公とは放課後によく一緒に帰る仲。夏祭りの日から少しだけ空気が変わった。',
      avatar: 'ゆ',
      avatarUrl: '/avatar-yui.svg',
      latestMessage: '今日、帰り寄り道しよ？',
      unread: 2,
    },
    {
      id: 'ren',
      name: '蓮',
      relationship: '幼なじみ',
      age: '17',
      personality: 'ぶっきらぼうだが面倒見がいい。照れ屋で、心配していることを素直に言えない。',
      speakingStyle: '短文。少し雑。たまに核心をつく。『別に』『まあ』を使いがち。',
      backstory: '小学校からの幼なじみ。部活帰りに駅前でよく会う。主人公の昔の失敗も全部知っている。',
      avatar: '蓮',
      avatarUrl: '/avatar-ren.svg',
      latestMessage: 'お前、今日なんか変だったぞ',
      unread: 0,
    },
    {
      id: 'mika',
      name: '美佳',
      relationship: '部活の先輩',
      age: '18',
      personality: '落ち着いていて優しい。少し大人っぽいが、本当は別れに弱い。',
      speakingStyle: '丁寧だけど親しみがある。ゆっくり励ます。語尾はやわらかい。',
      backstory: '部活の先輩。卒業を控えていて、町を離れる予定。主人公に何かを残そうとしている。',
      avatar: '美',
      avatarUrl: '/avatar-mika.svg',
      latestMessage: 'あと少しで夏も終わるね',
      unread: 1,
    },
    {
      id: 'sora',
      name: '空',
      relationship: '隣の席',
      age: '17',
      personality: '無口で観察力がある。教室では静かだが、二人になると意外とよく話す。',
      speakingStyle: '淡々としている。短い一言に感情が乗る。絵文字は使わない。',
      backstory: '2学期から隣の席になった。ノートの端に小さな絵を描く癖がある。主人公のことを少し気にしている。',
      avatar: '空',
      avatarUrl: '/avatar-sora.svg',
      latestMessage: '今日の空、見た？',
      unread: 0,
    },
    {
      id: 'aki',
      name: '亜希',
      relationship: '親友',
      age: '17',
      personality: '明るく現実的。恋愛相談には鋭い。少しおせっかいだが愛情深い。',
      speakingStyle: 'テンポが早い。ツッコミ多め。『いやそれはさ』が口癖。',
      backstory: '主人公の親友。購買でよく一緒にパンを買う。主人公の好きな人を薄々知っている。',
      avatar: '亜',
      avatarUrl: '/avatar-aki.svg',
      latestMessage: 'で、結局どうなったの？',
      unread: 3,
    },
    {
      id: 'haru',
      name: '春斗',
      relationship: 'クラスメイト',
      age: '17',
      personality: '陽気で誰とでも話す。軽く見えるが、人の寂しさには敏感。',
      speakingStyle: '砕けた男子っぽい口調。軽い冗談を挟む。返信は短い。',
      backstory: '文化祭の準備で急に仲良くなった。冗談ばかり言うが、時々かなり優しい。',
      avatar: '春',
      avatarUrl: '/avatar-haru.svg',
      latestMessage: '文化祭のやつ、まだ残ってる？',
      unread: 0,
    },
    {
      id: 'nana',
      name: '菜々',
      relationship: '後輩',
      age: '16',
      personality: '人懐っこくて素直。少し背伸びしたがる。褒められるとすぐ嬉しそうにする。',
      speakingStyle: '丁寧寄り。『です！』『ほんとですか？』が多い。絵文字を少し使う。',
      backstory: '部活の後輩。主人公を少し憧れの目で見ている。相談したいことがあるが言い出せない。',
      avatar: '菜',
      avatarUrl: '/avatar-nana.svg',
      latestMessage: '先輩、今日少し話せますか？',
      unread: 1,
    },
    {
      id: 'daichi',
      name: '大地',
      relationship: 'バイト仲間',
      age: '18',
      personality: '気さくで面倒見がいい。悩みを笑いに変えるのが得意。',
      speakingStyle: 'ラフ。少し兄貴っぽい。『まあなんとかなるって』をよく言う。',
      backstory: '駅前のコンビニで一緒にバイトしている。夜勤明けにくだらない話をする仲。',
      avatar: '大',
      avatarUrl: '/avatar-daichi.svg',
      latestMessage: '今日シフト入ってたっけ？',
      unread: 0,
    },
    {
      id: 'riko',
      name: '莉子',
      relationship: '元同じ塾',
      age: '17',
      personality: '真面目で努力家。言葉を選ぶタイプ。心配しても押しつけない。',
      speakingStyle: '落ち着いた文章。句読点をちゃんと使う。少しだけ距離がある。',
      backstory: '中学時代に同じ塾だった。今は別の学校。たまに近況を送り合う、消えそうで消えない関係。',
      avatar: '莉',
      avatarUrl: '/avatar-riko.svg',
      latestMessage: '久しぶり。元気にしてる？',
      unread: 0,
    },
    {
      id: 'toma',
      name: '冬馬',
      relationship: '写真部',
      age: '17',
      personality: '感性が強く、少し皮肉屋。写真や音楽の話になると急に饒舌。',
      speakingStyle: '静かで少し文学的。でも長すぎない。絵文字なし。',
      backstory: '写真部で一緒。主人公の横顔を何度か撮っているが、本人には見せていない。',
      avatar: '冬',
      avatarUrl: '/avatar-toma.svg',
      latestMessage: '昨日の写真、現像できた',
      unread: 1,
    },
    {
      id: 'mao',
      name: '真央',
      relationship: '従姉妹',
      age: '19',
      personality: '自由でマイペース。少し大人の視点で、主人公の悩みを軽くしてくれる。',
      speakingStyle: 'ゆるい。ひらがな多め。『いいじゃん』と軽く背中を押す。',
      backstory: '夏休みにだけ会う従姉妹。都会の大学に通っている。主人公にとって少し憧れの存在。',
      avatar: '真',
      avatarUrl: '/avatar-mao.svg',
      latestMessage: 'その話、なんか青春じゃん',
      unread: 0,
    },
    {
      id: 'shun',
      name: '俊',
      relationship: 'ライバル',
      age: '17',
      personality: '負けず嫌いで素直じゃない。認めている相手ほどきつく言う。',
      speakingStyle: '短く強め。煽るけど悪意はない。たまに本音が漏れる。',
      backstory: '成績や部活で何かと比べられる存在。衝突も多いが、互いに意識している。',
      avatar: '俊',
      avatarUrl: '/avatar-shun.svg',
      latestMessage: '次は負けねえから',
      unread: 0,
    },
    {
      id: 'eri',
      name: '絵里',
      relationship: '図書室で会う人',
      age: '17',
      personality: '物静かで優しい。自分の話はあまりしないが、人の話を覚えている。',
      speakingStyle: '静かで丁寧。少し余白のある返事。『そうなんだ』から入ることが多い。',
      backstory: '放課後の図書室でよく会う。貸出カードに残る名前だけで、少しずつ近づいた関係。',
      avatar: '絵',
      avatarUrl: '/avatar-eri.svg',
      latestMessage: 'この前の本、読めた？',
      unread: 1,
    }
  ],
  albums: [
    {
      id: 'summer',
      title: '夏の終わり',
      description: '放課後、夏祭り、駅前。少しだけ言葉が足りなかった季節。',
      coverUrl: '/feature-album.jpg',
      photos: [
        {
          id: 'summer-1',
          title: '放課後の教室',
          caption: '誰もいない教室に、夕方の光だけが残っていた。',
          date: '1999.07.12 16:42',
          imageUrl: '/feature-diary.jpg',
        },
        {
          id: 'summer-2',
          title: '夏祭りの帰り道',
          caption: '屋台の明かりが遠くなっても、まだ帰りたくなかった。',
          date: '1999.08.15 21:18',
          imageUrl: '/feature-sns.jpg',
        },
        {
          id: 'summer-3',
          title: '駅前のコンビニ',
          caption: 'アイスを買っただけなのに、妙に覚えている夜。',
          date: '1999.08.23 20:07',
          imageUrl: '/feature-search.jpg',
        },
      ],
    },
    {
      id: 'room',
      title: '自分の部屋',
      description: 'ポスター、古い机、散らかったプリント。誰にも見せなかった日々。',
      coverUrl: '/feature-item.jpg',
      photos: [
        {
          id: 'room-1',
          title: '机の上',
          caption: '使いかけのペンと、書けなかった手紙。',
          date: '1999.09.02 23:14',
          imageUrl: '/feature-item.jpg',
        },
        {
          id: 'room-2',
          title: '夜の部屋',
          caption: '窓の外から、遠くの電車の音が聞こえた。',
          date: '1999.09.10 00:31',
          imageUrl: '/feature-music.jpg',
        },
      ],
    },
  ],
};

const WORLDLINE_KEY = 'kaku-jibunshi-worldline';
const MESSAGE_KEY = 'kaku-jibunshi-messages';

function normalizeWorldline(raw: Partial<Worldline>, input?: Partial<Worldline>): Worldline {
  const base = {
    ...defaultWorldline,
    ...raw,
    ...input,
  };

  return {
    ...base,
    id: base.id || `worldline-${Date.now()}`,
    characters: Array.isArray(base.characters) && base.characters.length ? base.characters : defaultWorldline.characters,
    albums: Array.isArray(base.albums) && base.albums.length ? base.albums : defaultWorldline.albums,
    album: Array.isArray(base.album) ? base.album : defaultWorldline.album,
    line: Array.isArray(base.line) ? base.line : defaultWorldline.line,
    snsPosts: Array.isArray(base.snsPosts) && base.snsPosts.length ? base.snsPosts : defaultWorldline.snsPosts,
    search: Array.isArray(base.search) ? base.search : defaultWorldline.search,
  };
}

function getWorldline(): Worldline {
  try {
    const raw = localStorage.getItem(WORLDLINE_KEY);
    if (!raw) return defaultWorldline;
    return normalizeWorldline(JSON.parse(raw));
  } catch {
    return defaultWorldline;
  }
}

function saveWorldline(worldline: Worldline) {
  localStorage.setItem(WORLDLINE_KEY, JSON.stringify(worldline));
}

function getMessages(friendId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[friendId] ?? [];
  } catch {
    return [];
  }
}

function saveMessages(friendId: string, messages: ChatMessage[]) {
  const raw = localStorage.getItem(MESSAGE_KEY);
  const all = raw ? JSON.parse(raw) : {};
  all[friendId] = messages;
  localStorage.setItem(MESSAGE_KEY, JSON.stringify(all));
}

function setHash(path: string) {
  window.location.hash = path;
}

function getHashRoute() {
  const raw = window.location.hash.replace(/^#/, '');
  return raw || '/';
}

function useHashRoute() {
  const [route, setRoute] = useState(getHashRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(getHashRoute());
    window.addEventListener('hashchange', onHashChange);
    onHashChange();
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}

async function safeJsonFetch(url: string, options: RequestInit) {
  const res = await fetch(url, options);
  const text = await res.text();

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    const shortText = text.replace(/\s+/g, ' ').slice(0, 180);
    throw new Error(
      `APIがJSONではなくテキストを返しました。status=${res.status} ${res.statusText} / ${shortText}`
    );
  }

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `APIエラー status=${res.status}`);
  }

  return data;
}

const features = [
  { no: '1', title: '写真・アルバム', text: '存在しない写真が、まるで古いアルバムのように並びます。', image: '/feature-album.jpg', route: '/albums' },
  { no: '2', title: '会話の記録', text: '友達一覧から相手を選び、その世界線の中で会話できます。', image: '/feature-line.jpg', route: '/friends' },
  { no: '3', title: 'SNS投稿', text: '世界線に合わせた投稿一覧。海辺なら海辺、中学生なら中学生らしい投稿に変わります。', image: '/feature-sns.jpg', route: '/sns' },
  { no: '4', title: '検索履歴', text: 'その人の人生がにじむ、妙にリアルな検索履歴。', image: '/feature-search.jpg', route: '/' },
  { no: '5', title: '日記・つぶやき', text: '誰にも見せなかったノートのような短い記録。', image: '/feature-diary.jpg', route: '/' },
  { no: '6', title: '思い出の品', text: 'ケータイ、キーホルダー、チケット。物から人生の断片を作る。', image: '/feature-item.jpg', route: '/' },
  { no: '7', title: '音楽・BGM', text: 'その世界に流れていそうなBGMタイトルや歌詞っぽい空気。', image: '/feature-music.jpg', route: '/' },
];

const presets = [
  ['1999年', '地方の海辺の町', '高校2年生', '切なくて懐かしい'],
  ['2006年', '夕方の団地', '中学生', '少し痛くて優しい'],
  ['2012年', '雪の日の駅前', '売れないバンドマン', '静かで映画っぽい'],
];

function FriendAvatar({ friend, className = '' }: { friend: Character; className?: string }) {
  return (
    <div className={`friend-avatar ${className}`.trim()}>
      {friend.avatarUrl ? (
        <img src={friend.avatarUrl} alt={`${friend.name}のアイコン`} />
      ) : (
        <span>{friend.avatar}</span>
      )}
    </div>
  );
}

function Shell({ route, children }: { route: string; children: React.ReactNode }) {
  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => setHash('/')}>
          <span className="brand-mark">架</span>
          <span>
            <strong>架空自分史</strong>
            <small>存在しないあなたを、記録する。</small>
          </span>
        </button>

        <nav className="desktop-nav">
          <button className={route === '/' ? 'active' : ''} onClick={() => setHash('/')}>ホーム</button>
          <button className={route.startsWith('/friends') || route.startsWith('/chat') ? 'active' : ''} onClick={() => setHash('/friends')}>会話</button>
          <button className={route === '/sns' ? 'active' : ''} onClick={() => setHash('/sns')}>SNS</button>
          <button className={route.startsWith('/albums') ? 'active' : ''} onClick={() => setHash('/albums')}>アルバム</button>
        </nav>
      </header>

      {children}

      <nav className="bottom-nav" aria-label="メインナビゲーション">
        <button className={route === '/' ? 'active' : ''} onClick={() => setHash('/')}>
          <span>⌂</span>
          <small>ホーム</small>
        </button>
        <button className={route.startsWith('/friends') || route.startsWith('/chat') ? 'active' : ''} onClick={() => setHash('/friends')}>
          <span>💬</span>
          <small>会話</small>
        </button>
        <button className={route === '/sns' ? 'active' : ''} onClick={() => setHash('/sns')}>
          <span>♡</span>
          <small>SNS</small>
        </button>
        <button className={route.startsWith('/albums') ? 'active' : ''} onClick={() => setHash('/albums')}>
          <span>▧</span>
          <small>アルバム</small>
        </button>
      </nav>
    </div>
  );
}

function HomePage({ onWorldlineUpdate }: { onWorldlineUpdate: (worldline: Worldline) => void }) {
  const [era, setEra] = useState('1999年');
  const [place, setPlace] = useState('地方の海辺の町');
  const [role, setRole] = useState('高校2年生');
  const [mood, setMood] = useState('切なくて懐かしい');
  const [worldline, setWorldline] = useState<Worldline>(() => getWorldline());
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [remainingCount, setRemainingCount] = useState<number | null>(null);

  const loadingText = useMemo(() => {
    if (!isGenerating) return '';
    return '自分史を生成しています… 友達、アルバム、日記をつなぎ合わせています。';
  }, [isGenerating]);

  const handlePreset = (preset: string[]) => {
    setEra(preset[0]);
    setPlace(preset[1]);
    setRole(preset[2]);
    setMood(preset[3]);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage('');

    try {
      const data = await safeJsonFetch('/api/worldline-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ era, place, role, mood }),
      });

      const nextWorldline = normalizeWorldline(data.result ?? {}, { era, place, role, mood });
      saveWorldline(nextWorldline);
      setWorldline(nextWorldline);
      onWorldlineUpdate(nextWorldline);

      if (typeof data.remaining === 'number') {
        setRemainingCount(data.remaining);
      }
    } catch (e: any) {
      setErrorMessage(e?.message || '生成に失敗しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">存在しないあなたを、記録する。</p>
          <h1>架空自分史</h1>
          <p className="lead">
            写真、会話、検索履歴、日記、思い出の品まで。
            あなたが選ばなかった世界線を、ひとつの自分史として生成します。
          </p>

          <div className="hero-actions">
            <a href="#create" className="primary-button">自分史をつくる</a>
            <button className="ghost-button" onClick={() => setHash('/friends')}>会話を開く</button>
            <button className="ghost-button" onClick={() => setHash('/albums')}>アルバムを見る</button>
          </div>
        </div>

        <div className="hero-phone" aria-label="架空自分史プレビュー">
          <div className="phone-bar">9:41</div>
          <div className="phone-scene">
            <span>{worldline.era}・{worldline.mood}</span>
            <strong>{worldline.title}</strong>
            <p>{worldline.summary}</p>
          </div>
          <div className="phone-tabs">
            <span>写真</span><span>会話</span><span>SNS</span><span>日記</span>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="section-heading">
          <p className="eyebrow">Fictional Autobiography</p>
          <h2>タップすると、その自分史の中へ入れる。</h2>
          <p>会話は友達一覧へ、アルバムは写真フォルダへ。単なる生成結果ではなく、触れる記録として残します。</p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <button className="feature-card" key={feature.no} onClick={() => setHash(feature.route)}>
              <div className="feature-image-wrap">
                <span className="feature-no">{feature.no}</span>
                <img src={feature.image} alt={feature.title} className="feature-image" />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </button>
          ))}
        </div>
      </section>

      <section id="create" className="section creator">
        <div className="creator-panel">
          <div>
            <p className="eyebrow">Create Your Worldline</p>
            <h2>設定を入れるだけで、世界線が立ち上がる。</h2>
            <p className="muted">生成後は、会話とアルバムがアプリ内に保存されます。</p>
          </div>

          <div className="preset-row">
            {presets.map((preset) => (
              <button type="button" key={preset.join('-')} onClick={() => handlePreset(preset)}>
                {preset[0]} / {preset[2]}
              </button>
            ))}
          </div>

          <div className="form-grid">
            <label>時代<input value={era} onChange={(e) => setEra(e.target.value)} /></label>
            <label>場所<input value={place} onChange={(e) => setPlace(e.target.value)} /></label>
            <label>立場<input value={role} onChange={(e) => setRole(e.target.value)} /></label>
            <label>雰囲気<input value={mood} onChange={(e) => setMood(e.target.value)} /></label>
          </div>

          <button className="generate-button" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? '生成中…' : 'もうひとつの人生を生成する'}
          </button>

          {remainingCount !== null && (
            <p className="limit-text">本日の残り生成回数：{remainingCount}回</p>
          )}
          {loadingText && <p className="loading-text">{loadingText}</p>}
          {errorMessage && <p className="error-text">{errorMessage}</p>}
        </div>

        <div className="result-panel">
          <div className="empty-result">
            <span>まだ存在しない世界線</span>
            <p>生成すると、ここに写真・会話・日記・検索履歴がまとまって表示されます。</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function FriendsPage({ worldline }: { worldline: Worldline }) {
  return (
    <main className="sub-page">
      <section className="sub-hero compact">
        <p className="eyebrow">Conversation Archive</p>
        <h1>会話の記録</h1>
        <p>この自分史の中にいる人たち。相手を選ぶと、その人の性格や関係性のまま会話できます。</p>
      </section>

      <section className="phone-list-panel">
        <div className="app-screen-header">
          <span>9:41</span>
          <strong>友だち</strong>
          <span>編集</span>
        </div>

        <div className="friend-list">
          {worldline.characters.map((friend) => (
            <button className="friend-item" key={friend.id} onClick={() => setHash(`/chat/${friend.id}`)}>
              <FriendAvatar friend={friend} />
              <div className="friend-main">
                <div className="friend-name-row">
                  <strong>{friend.name}</strong>
                  <span>{friend.relationship}</span>
                </div>
                <p>{friend.latestMessage}</p>
              </div>
              {friend.unread ? <span className="unread-badge">{friend.unread}</span> : <span className="chevron">›</span>}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function ChatPage({ worldline, friendId }: { worldline: Worldline; friendId: string }) {
  const friend = worldline.characters.find((x) => x.id === friendId) ?? worldline.characters[0];
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = getMessages(friend.id);
    if (saved.length) return saved;
    return [{
      id: `seed-${friend.id}`,
      friendId: friend.id,
      role: 'assistant',
      text: friend.latestMessage,
      createdAt: new Date().toISOString(),
    }];
  });
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      friendId: friend.id,
      role: 'user',
      text: input.trim(),
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    saveMessages(friend.id, nextMessages);
    setInput('');
    setIsSending(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/chat-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worldline, character: friend, history: nextMessages, message: userMessage.text }),
      });

      const text = await res.text();
      let data: any = null;

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        const shortText = text.replace(/\s+/g, ' ').slice(0, 180);
        throw new Error(`会話APIがJSON以外を返しました。status=${res.status} ${res.statusText} / ${shortText}`);
      }

      if (!res.ok) {
        throw new Error(data?.message || data?.error || `会話APIエラー status=${res.status}`);
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        friendId: friend.id,
        role: 'assistant',
        text: data.reply || 'うん、なんか少しだけわかる気がする。',
        createdAt: new Date().toISOString(),
      };

      const completed = [...nextMessages, assistantMessage];
      setMessages(completed);
      saveMessages(friend.id, completed);
    } catch (e: any) {
      setErrorMessage(e?.message || '返信の生成に失敗しました。');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="chat-page">
      <section className="chat-shell">
        <div className="chat-statusbar">
          <span>9:41</span>
          <span>●●● 4G 82%</span>
        </div>

        <div className="chat-header">
          <button onClick={() => setHash('/friends')} aria-label="戻る">‹</button>
          <div className="chat-header-person">
            <FriendAvatar friend={friend} className="small" />
            <div>
              <strong>{friend.name}</strong>
              <span>{friend.relationship}・{worldline.era}</span>
            </div>
          </div>
          <span className="chat-menu">☰</span>
        </div>

        <div className="character-card">
          <strong>{friend.name}の設定</strong>
          <p>{friend.personality}</p>
          <small>{friend.backstory}</small>
        </div>

        <div className="chat-body">
          <div className="chat-date">{worldline.era}　{worldline.place}</div>

          {messages.map((message) => (
            <div className={`chat-row ${message.role === 'user' ? 'mine' : 'other'}`} key={message.id}>
              {message.role === 'assistant' && <FriendAvatar friend={friend} className="mini" />}
              <div className="chat-bubble-stack">
                <p className="chat-bubble">{message.text}</p>
                <span className="chat-time">{message.role === 'user' ? '既読 ' : ''}19:4{Math.floor(Math.random() * 9)}</span>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="chat-row other">
              <FriendAvatar friend={friend} className="mini" />
              <div className="typing-bubble"><span></span><span></span><span></span></div>
            </div>
          )}
        </div>

        {errorMessage && <p className="chat-error">{errorMessage}</p>}

        <div className="chat-inputbar">
          <button type="button">＋</button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`${friend.name}に送る`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button type="button" onClick={handleSend} disabled={isSending || !input.trim()}>
            送信
          </button>
        </div>
      </section>
    </main>
  );
}


function SnsPage({ worldline }: { worldline: Worldline }) {
  return (
    <main className="sub-page">
      <section className="sub-hero compact">
        <p className="eyebrow">Social Archive</p>
        <h1>SNS投稿</h1>
        <p>
          この世界線に流れている投稿一覧。時代・場所・立場・雰囲気に合わせて、投稿者や内容が変わります。
        </p>
      </section>

      <section className="sns-layout">
        <div className="sns-phone">
          <div className="sns-topbar">
            <span>9:41</span>
            <strong>{worldline.era}のタイムライン</strong>
            <span>検索</span>
          </div>

          <div className="sns-feed">
            {worldline.snsPosts.map((post) => (
              <article className="sns-card" key={post.id}>
                <header className="sns-card-header">
                  <img src={post.avatarUrl} alt={`${post.displayName}のアイコン`} />
                  <div>
                    <strong>{post.displayName}</strong>
                    <span>@{post.userName}・{post.postedAt}</span>
                  </div>
                </header>

                <p className="sns-content">{post.content}</p>

                {post.imageUrl && (
                  <img src={post.imageUrl} alt="投稿画像" className="sns-image" />
                )}

                <footer className="sns-actions">
                  <span>♡ {post.likes}</span>
                  <span>💬 {post.comments.length}</span>
                  {post.location && <span>📍 {post.location}</span>}
                </footer>

                {post.comments.length > 0 && (
                  <div className="sns-comments">
                    {post.comments.slice(0, 2).map((comment, index) => (
                      <p key={`${post.id}-comment-${index}`}>{comment}</p>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}


function AlbumsPage({ worldline }: { worldline: Worldline }) {
  return (
    <main className="sub-page">
      <section className="sub-hero compact">
        <p className="eyebrow">Photo Archive</p>
        <h1>架空アルバム</h1>
        <p>この自分史に保存されている写真。日付、場所、キャプションまで、ひとつの記録として残ります。</p>
      </section>

      <section className="album-grid">
        {worldline.albums.map((album) => (
          <button onClick={() => setHash(`/albums/${album.id}`)} className="album-card" key={album.id}>
            <img src={album.coverUrl} alt={album.title} />
            <div>
              <strong>{album.title}</strong>
              <p>{album.description}</p>
              <span>{album.photos.length}枚の写真</span>
            </div>
          </button>
        ))}
      </section>
    </main>
  );
}

function AlbumDetailPage({ worldline, albumId }: { worldline: Worldline; albumId: string }) {
  const album = worldline.albums.find((x) => x.id === albumId) ?? worldline.albums[0];

  return (
    <main className="sub-page">
      <section className="sub-hero compact">
        <button onClick={() => setHash('/albums')} className="back-link">‹ アルバム一覧へ</button>
        <p className="eyebrow">Album Detail</p>
        <h1>{album.title}</h1>
        <p>{album.description}</p>
      </section>

      <section className="photo-grid">
        {album.photos.map((photo) => (
          <article className="photo-card" key={photo.id}>
            <img src={photo.imageUrl} alt={photo.title} />
            <div>
              <span>{photo.date}</span>
              <strong>{photo.title}</strong>
              <p>{photo.caption}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function App() {
  const route = useHashRoute();
  const [worldline, setWorldline] = useState<Worldline>(() => getWorldline());

  useEffect(() => {
    setWorldline(getWorldline());
  }, [route]);

  let page: React.ReactNode;

  if (route.startsWith('/chat/')) {
    page = <ChatPage worldline={worldline} friendId={route.replace('/chat/', '')} />;
  } else if (route.startsWith('/albums/')) {
    page = <AlbumDetailPage worldline={worldline} albumId={route.replace('/albums/', '')} />;
  } else if (route === '/friends') {
    page = <FriendsPage worldline={worldline} />;
  } else if (route === '/sns') {
    page = <SnsPage worldline={worldline} />;
  } else if (route === '/albums') {
    page = <AlbumsPage worldline={worldline} />;
  } else {
    page = <HomePage onWorldlineUpdate={setWorldline} />;
  }

  return <Shell route={route}>{page}</Shell>;
}

export default App;
