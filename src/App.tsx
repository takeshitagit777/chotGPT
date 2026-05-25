import { useMemo, useState } from 'react';
import './App.css';

type StoryInput = {
  era: string;
  place: string;
  role: string;
  mood: string;
};

const chips = ['写真・アルバム', 'LINEのやりとり', 'SNS投稿', '検索履歴', '日記・つぶやき', '思い出の品', '音楽・BGM'];

const scenes = [
  { title: '放課後の教室', text: '窓ぎわの席、夕焼け、まだ帰りたくなかった日。' },
  { title: '夏祭りの帰り道', text: '屋台の明かりと、言えなかったひとこと。' },
  { title: '深夜の電話', text: '寝たふりをしながら、何度も画面を見た。' },
  { title: '雪の日の駅', text: 'ホームの白い息だけ、やけに覚えている。' },
];

export default function App() {
  const [input, setInput] = useState<StoryInput>({ era: '1999年', place: '地方の町', role: '高校生', mood: '少し切ない' });
  const [generated, setGenerated] = useState(false);

  const story = useMemo(() => {
    return `${input.era}、${input.place}で${input.role}だったあなた。${input.mood}空気の中で、存在しなかったはずの思い出が少しずつ立ち上がります。`;
  }, [input]);

  const update = (key: keyof StoryInput, value: string) => setInput((prev) => ({ ...prev, [key]: value }));

  return (
    <main className="site-shell">
      <section className="hero">
        <div className="hero-bg" />
        <nav className="nav">
          <div className="brand"><span>あったかもしれない</span><b>GPT</b></div>
          <a href="#create" className="nav-cta">世界線をつくる</a>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">AIが生成する、もうひとつのあなたの世界。</p>
            <h1>もし、別の人生を<br />生きていたら。</h1>
            <p className="lead">写真、LINE、SNS、検索履歴、日記まで。存在しなかったはずなのに、なぜか懐かしい“あなたのif”を丸ごと生成します。</p>
            <div className="hero-actions">
              <a href="#create" className="primary-btn">無料で試す</a>
              <a href="#features" className="ghost-btn">生成される内容を見る</a>
            </div>
            <div className="emotion-pills">
              <span>エモくて泣ける</span><span>シェアしたくなる</span><span>自分だけの物語</span>
            </div>
          </div>

          <div className="phone-stage">
            <div className="phone">
              <div className="phone-top"><span>9:41</span><span>◌ ◌ ◌</span></div>
              <div className="phone-screen">
                <p className="screen-meta">{input.era}・夏</p>
                <h2>{input.role}のわたし</h2>
                <div className="memory-card big-card"><span>放課後、みんなで寄り道してたあの坂道。</span></div>
                <div className="mini-gallery"><i /><i /><i /></div>
                <button onClick={() => setGenerated(true)}>この世界線をのぞく →</button>
              </div>
            </div>
            <div className="floating-note">存在しないのに、なぜか懐かしい。</div>
            <div className="polaroid p1">夏祭りの夜</div>
            <div className="polaroid p2">はじめてのケータイ</div>
          </div>
        </div>
      </section>

      <section id="features" className="section features-section">
        <div className="section-head">
          <p className="eyebrow">Generated Contents</p>
          <h2>生成されるのは、画像だけじゃない。</h2>
          <p>ひとつの世界線として、思い出の断片がつながっていきます。</p>
        </div>
        <div className="feature-grid">
          {chips.map((chip, index) => (
            <article className="feature-card" key={chip}>
              <div className="feature-visual"><span>{index + 1}</span></div>
              <h3>{chip}</h3>
              <p>{index === 0 ? '存在しないアルバムが、まるで昔の写真フォルダのように並びます。' : index === 1 ? '言えなかった言葉や何気ない会話まで、世界線に合わせて生成。' : index === 2 ? '当時っぽい投稿、コメント、いいねまで作り込めます。' : index === 3 ? 'その人の人生がにじむ、妙にリアルな検索履歴。' : index === 4 ? '誰にも見せなかったノートのような短い記録。' : index === 5 ? 'ケータイ、キーホルダー、チケット。物から記憶を作る。' : 'その世界に流れていそうなBGMタイトルや歌詞っぽい空気。'}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="create" className="section creator-section">
        <div className="creator-panel">
          <div className="creator-form">
            <p className="eyebrow">3 Steps</p>
            <h2>あなたの世界線を作る</h2>
            <label>時代<input value={input.era} onChange={(e) => update('era', e.target.value)} /></label>
            <label>場所<input value={input.place} onChange={(e) => update('place', e.target.value)} /></label>
            <label>あなたの設定<input value={input.role} onChange={(e) => update('role', e.target.value)} /></label>
            <label>空気感<input value={input.mood} onChange={(e) => update('mood', e.target.value)} /></label>
            <button onClick={() => setGenerated(true)}>生成スタート</button>
          </div>
          <div className="creator-preview">
            <div className="preview-orb"><span /></div>
            <div className="preview-output">
              <h3>{generated ? 'あなたの世界線が完成しました' : '生成プレビュー'}</h3>
              <p>{story}</p>
              <div className="output-row"><b>LINE</b><span>「今日、帰りちょっと遠回りしない？」</span></div>
              <div className="output-row"><b>検索</b><span>好きな人 脈あり / 夏祭り 服装 / 将来 不安</span></div>
              <div className="output-row"><b>日記</b><span>今日は楽しかった。でも、少しだけ寂しかった。</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section scenes-section">
        <div className="section-head compact"><p className="eyebrow">World Samples</p><h2>生成される世界観</h2></div>
        <div className="scene-row">
          {scenes.map((scene) => <article className="scene-card" key={scene.title}><div /><h3>{scene.title}</h3><p>{scene.text}</p></article>)}
        </div>
      </section>

      <section className="section pricing-section">
        <div className="section-head"><p className="eyebrow">Plans</p><h2>まずは無料で。深く作るならプレミアム。</h2></div>
        <div className="pricing-grid">
          <div className="price-card"><h3>無料プラン</h3><p className="price">¥0</p><ul><li>1日3回まで生成</li><li>基本コンテンツ</li><li>シェア機能</li></ul></div>
          <div className="price-card premium"><div className="crown">♛</div><h3>プレミアム</h3><p className="price">¥980<span>/月〜</span></p><ul><li>高画質・動画生成</li><li>BGM・音楽生成</li><li>自分の写真を反映</li><li>AI友達・AI恋人の追加</li><li>保存無制限・広告なし</li></ul></div>
        </div>
      </section>
    </main>
  );
}
