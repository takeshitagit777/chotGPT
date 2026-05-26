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
      personality: '明るいけれど、ふとした瞬間に寂しさが出る。相手の変化に敏感。',
      speakingStyle: '短めで自然。少しだけ絵文字を使う。距離感は近いが、踏み込みすぎない。',
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
      personality: 'ぶっきらぼうだが面倒見がいい。昔から主人公を知っている。',
      speakingStyle: '少し雑で短い。照れ隠しが多い。たまに核心をつく。',
      backstory: '小学校からの幼なじみ。部活帰りに駅前でよく会う。言葉数は少ないが、主人公のことをよく見ている。',
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
      personality: '落ち着いていて優しい。少し大人っぽく、相談相手になってくれる。',
      speakingStyle: '丁寧だけど親しみがある。語尾はやわらかい。',
      backstory: '部活の先輩。卒業を控えていて、町を離れる予定。主人公に何かを残そうとしている。',
      avatar: '美',
      avatarUrl: '/avatar-mika.svg',
      latestMessage: 'あと少しで夏も終わるね',
      unread: 1,
    },
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
  { no: '3', title: 'SNS投稿', text: '当時っぽい投稿、コメント、いいねまで自分史の断片として再現します。', image: '/feature-sns.jpg', route: '/' },
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
      const data = await safeJsonFetch('/api/generate', {
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
  } else if (route === '/albums') {
    page = <AlbumsPage worldline={worldline} />;
  } else {
    page = <HomePage onWorldlineUpdate={setWorldline} />;
  }

  return <Shell route={route}>{page}</Shell>;
}

export default App;
