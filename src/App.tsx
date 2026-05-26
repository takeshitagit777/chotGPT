import { useMemo, useState } from 'react';
import './App.css';

type WorldResult = {
  title: string;
  album: string[];
  line: string[];
  sns: string;
  search: string[];
  diary: string;
  item: string;
  bgm: string;
};

const features = [
  { no: '1', title: '写真・アルバム', text: '存在しないアルバムが、まるで昔の写真フォルダのように並びます。', image: '/feature-album.jpg' },
  { no: '2', title: 'LINEのやりとり', text: '言えなかった言葉や何気ない会話まで、世界線に合わせて生成。', image: '/feature-line.jpg' },
  { no: '3', title: 'SNS投稿', text: '当時っぽい投稿、コメント、いいねまで作り込みます。', image: '/feature-sns.jpg' },
  { no: '4', title: '検索履歴', text: 'その人の人生がにじむ、妙にリアルな検索履歴。', image: '/feature-search.jpg' },
  { no: '5', title: '日記・つぶやき', text: '誰にも見せなかったノートのような短い記録。', image: '/feature-diary.jpg' },
  { no: '6', title: '思い出の品', text: 'ケータイ、キーホルダー、チケット。物から記憶を作る。', image: '/feature-item.jpg' },
  { no: '7', title: '音楽・BGM', text: 'その世界に流れていそうなBGMタイトルや歌詞っぽい空気。', image: '/feature-music.jpg' },
];

const presets = [
  ['1999年', '地方の海辺の町', '高校2年生', '切なくて懐かしい'],
  ['2006年', '夕方の団地', '中学生', '少し痛くて優しい'],
  ['2012年', '雪の日の駅前', '売れないバンドマン', '静かで映画っぽい'],
];

function App() {
  const [era, setEra] = useState('1999年');
  const [place, setPlace] = useState('地方の海辺の町');
  const [role, setRole] = useState('高校2年生');
  const [mood, setMood] = useState('切なくて懐かしい');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<WorldResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [remainingCount, setRemainingCount] = useState<number | null>(null);

  const loadingText = useMemo(() => {
    if (!isGenerating) return '';
    return '世界線を生成しています… 写真、会話、検索履歴をつなぎ合わせています。';
  }, [isGenerating]);

  const handlePreset = (preset: string[]) => {
    setEra(preset[0]);
    setPlace(preset[1]);
    setRole(preset[2]);
    setMood(preset[3]);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerated(null);
    setErrorMessage('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ era, place, role, mood }),
      });

      const data = await res.json();

      if (typeof data.remaining === 'number') {
        setRemainingCount(data.remaining);
      }

      if (!res.ok) {
        throw new Error(data?.message || data?.error || '生成APIでエラーが発生しました。');
      }

      if (!data.result) {
        throw new Error('生成結果が空でした。');
      }

      setGenerated(data.result);
    } catch (e: any) {
      setErrorMessage(e?.message || '生成に失敗しました。Vercelのログを確認してください。');
      setGenerated(null);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">存在しなかったはずなのに、なぜか懐かしい。</p>
          <h1>あったかもしれない</h1>
          <p className="lead">
            写真、会話、検索履歴、日記、思い出の品まで。
            あなたの「もうひとつの人生」を、ひとつの世界線として生成します。
          </p>
          <div className="hero-actions">
            <a href="#create" className="primary-button">世界線をつくる</a>
            <a href="#features" className="ghost-button">生成される内容を見る</a>
          </div>
        </div>

        <div className="hero-phone" aria-label="世界線プレビュー">
          <div className="phone-bar">9:41</div>
          <div className="phone-scene">
            <span>1999年・夏</span>
            <strong>高校2年生のわたし</strong>
            <p>放課後、みんなで寄り道してた。あの坂道の夕焼けだけ、なぜか覚えている。</p>
          </div>
          <div className="phone-tabs">
            <span>写真</span><span>LINE</span><span>SNS</span><span>日記</span>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="section-heading">
          <p className="eyebrow">Generated Memories</p>
          <h2>単発の画像ではなく、人生ログとしてつながる。</h2>
          <p>バラバラの断片を重ねることで、「本当にあったかも」と感じる体験を作ります。</p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.no}>
              <div className="feature-image-wrap">
                <span className="feature-no">{feature.no}</span>
                <img src={feature.image} alt={feature.title} className="feature-image" />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="create" className="section creator">
        <div className="creator-panel">
          <div>
            <p className="eyebrow">Create Your Worldline</p>
            <h2>設定を入れるだけで、世界線が立ち上がる。</h2>
            <p className="muted">まずは軽く作って、気に入った世界線だけ深掘りする設計です。</p>
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
          {generated ? (
            <div className="result-content">
              <p className="eyebrow">Generated</p>
              <h3>{generated.title}</h3>
              <div className="result-block"><strong>写真アルバム</strong><ul>{generated.album?.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
              <div className="result-block"><strong>LINE</strong><ul>{generated.line?.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
              <div className="result-block"><strong>SNS投稿</strong><p>{generated.sns}</p></div>
              <div className="result-block"><strong>検索履歴</strong><ul>{generated.search?.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
              <div className="result-block"><strong>日記</strong><p>{generated.diary}</p></div>
              <div className="result-block"><strong>思い出の品</strong><p>{generated.item}</p></div>
              <div className="result-block"><strong>BGM</strong><p>{generated.bgm}</p></div>
            </div>
          ) : (
            <div className="empty-result">
              <span>まだ存在しない世界線</span>
              <p>生成すると、ここに写真・会話・日記・検索履歴がまとまって表示されます。</p>
            </div>
          )}
        </div>
      </section>

      <section className="pricing section">
        <div className="price-card free">
          <p className="eyebrow">Free</p>
          <h3>無料プラン</h3>
          <ul><li>1日3回まで生成</li><li>基本コンテンツ</li><li>シェア機能</li></ul>
        </div>
        <div className="price-card premium">
          <p className="eyebrow">Premium</p>
          <h3>プレミアム</h3>
          <ul><li>高画質・動画生成</li><li>自分の写真を反映</li><li>世界線の続きを生成</li><li>広告なし・保存無制限</li></ul>
        </div>
      </section>
    </main>
  );
}

export default App;
