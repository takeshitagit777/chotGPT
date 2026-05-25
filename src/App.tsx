import { useMemo, useState } from 'react';
import './App.css';

type StoryInput = {
  era: string;
  place: string;
  role: string;
  mood: string;
};

const presets = [
  { label: '1999年・夏', value: '1999年の夏' },
  { label: '2007年・冬', value: '2007年の冬' },
  { label: '2014年・春', value: '2014年の春' },
];

const worlds = [
  '放課後の教室',
  '夏祭りの帰り道',
  '深夜の電話',
  '雪の日の駅',
  'レトロな部屋',
  '海辺のドライブ',
];

const features = [
  ['写真・アルバム', '存在しなかったはずの一枚を生成'],
  ['LINEのやりとり', '当時の友達や恋人との会話ログ'],
  ['SNS投稿', '世界線の中の投稿・コメント・いいね'],
  ['検索履歴', 'その時の悩みや本音が見える'],
  ['日記・つぶやき', '少し痛くて、なぜか刺さる文章'],
  ['音楽・BGM', '記憶の温度に合わせた曲名と雰囲気'],
];

export default function App() {
  const [input, setInput] = useState<StoryInput>({
    era: '1999年の夏',
    place: '地方の海辺の町',
    role: '高校2年生',
    mood: '少し内向的だけど、音楽が好き',
  });

  const generated = useMemo(() => {
    return {
      title: `${input.era}、${input.place}で${input.role}だったあなた`,
      diary: `今日は夏祭りだった。浴衣を着て、まいと駅前で待ち合わせた。楽しかったはずなのに、帰り道だけ少し切なかった。存在しない記憶なのに、なぜか胸が痛い。`,
      search: ['片思い 脈あり サイン', '好きな人 LINE 続く', '夏祭り 告白 タイミング', '将来 不安 高校生'],
    };
  }, [input]);

  const update = (key: keyof StoryInput, value: string) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <main className="page">
      <section className="hero">
        <nav className="nav">
          <div className="brand"><span>✦</span> あったかもしれないGPT</div>
          <a href="#create" className="navButton">生成してみる</a>
        </nav>

        <div className="heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">AIが生成する、もうひとつのあなたの世界。</p>
            <h1>もし、別の人生を<br />生きていたら。</h1>
            <p className="lead">
              写真、LINE、SNS、検索履歴、日記まで。存在しなかったはずなのに、
              なぜか懐かしい“世界線ログ”をAIがまるごと作ります。
            </p>
            <div className="heroActions">
              <a href="#create" className="primary">世界線を作る</a>
              <a href="#features" className="secondary">できることを見る</a>
            </div>
            <div className="emotionBadges">
              <span>エモくて泣ける</span><span>シェアしたくなる</span><span>自分だけの物語</span>
            </div>
          </div>

          <div className="phoneWrap" aria-label="アプリ画面イメージ">
            <div className="phone">
              <div className="phoneTop"><span>9:41</span><span>● ● ●</span></div>
              <div className="phoneHero">
                <p>{input.era}</p>
                <h2>{input.role}のわたし</h2>
                <span>この世界線をのぞく →</span>
              </div>
              <div className="miniTabs"><span>写真</span><span>LINE</span><span>SNS</span><span>日記</span></div>
              <div className="memoryCard"><b>放課後の教室</b><small>風が気持ちよかった。</small></div>
              <div className="memoryCard"><b>夏祭りの夜</b><small>はじめての恋だった。</small></div>
            </div>
            <div className="polaroid p1">わたしの部屋</div>
            <div className="polaroid p2">夏祭りの夜</div>
          </div>
        </div>
      </section>

      <section id="features" className="section darkSection">
        <div className="sectionTitle">
          <p>生成される内容</p>
          <h2>ただの画像じゃなく、人生ログになる。</h2>
        </div>
        <div className="featureGrid">
          {features.map(([title, text], i) => (
            <article className="featureCard" key={title}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="create" className="section createSection">
        <div className="creator">
          <div className="panel inputPanel">
            <p className="eyebrow">3ステップで完成</p>
            <h2>あなたのifを入力</h2>
            <label>時代</label>
            <div className="chips">
              {presets.map((p) => (
                <button key={p.value} onClick={() => update('era', p.value)} className={input.era === p.value ? 'active' : ''}>{p.label}</button>
              ))}
            </div>
            <label>場所</label>
            <input value={input.place} onChange={(e) => update('place', e.target.value)} />
            <label>設定</label>
            <input value={input.role} onChange={(e) => update('role', e.target.value)} />
            <label>性格・雰囲気</label>
            <textarea value={input.mood} onChange={(e) => update('mood', e.target.value)} />
            <button className="generate">生成スタート！</button>
          </div>

          <div className="panel resultPanel">
            <div className="resultHeader">
              <span>生成プレビュー</span>
              <b>保存・シェアOK</b>
            </div>
            <h2>{generated.title}</h2>
            <div className="albumGrid">
              {worlds.slice(0, 4).map((w) => <div className="album" key={w}>{w}</div>)}
            </div>
            <div className="chatBox">
              <p className="bubble left">ねえ、今日帰り寄り道しよ？</p>
              <p className="bubble right">いいよ！どこ行く？</p>
              <p className="bubble left">内緒。たぶん忘れられない日になる。</p>
            </div>
            <div className="diary"><b>日記</b><p>{generated.diary}</p></div>
            <div className="searches"><b>検索履歴</b>{generated.search.map((s) => <span key={s}>⌕ {s}</span>)}</div>
          </div>
        </div>
      </section>

      <section className="section priceSection">
        <div className="sectionTitle">
          <p>マネタイズ設計</p>
          <h2>無料で拡散、プレミアムで深く遊ぶ。</h2>
        </div>
        <div className="priceGrid">
          <div className="priceCard">
            <h3>無料プラン</h3>
            <strong>¥0</strong>
            <p>1日3回生成 / 基本コンテンツ / シェア機能</p>
          </div>
          <div className="priceCard premium">
            <span className="crown">♛</span>
            <h3>プレミアム</h3>
            <strong>¥980/月〜</strong>
            <p>高画質・動画化・BGM・自分の顔を反映・保存無制限</p>
          </div>
          <div className="priceCard">
            <h3>ビジュアルプラン</h3>
            <strong>¥2,980</strong>
            <p>1世界線を高品質で生成。SNS投稿用に一括書き出し。</p>
          </div>
        </div>
      </section>
    </main>
  );
}
