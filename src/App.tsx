import { useMemo, useState } from 'react';
import './App.css';

type Feature = {
  no: string;
  title: string;
  text: string;
  image: string;
};

type StoryInput = {
  era: string;
  place: string;
  role: string;
  mood: string;
};

const features: Feature[] = [
  {
    no: '1',
    title: '写真・アルバム',
    text: '存在しないアルバムが、まるで昔の写真フォルダのように並びます。',
    image: '/feature-album.jpg',
  },
  {
    no: '2',
    title: 'LINEのやりとり',
    text: '言えなかった言葉や何気ない会話まで、世界線に合わせて生成。',
    image: '/feature-line.jpg',
  },
  {
    no: '3',
    title: 'SNS投稿',
    text: '当時っぽい投稿、コメント、いいねまで作り込みます。',
    image: '/feature-sns.jpg',
  },
  {
    no: '4',
    title: '検索履歴',
    text: 'その人の人生がにじむ、妙にリアルな検索履歴。',
    image: '/feature-search.jpg',
  },
  {
    no: '5',
    title: '日記・つぶやき',
    text: '誰にも見せなかったノートのような短い記録。',
    image: '/feature-diary.jpg',
  },
  {
    no: '6',
    title: '思い出の品',
    text: 'ケータイ、キーホルダー、チケット。物から記憶を作る。',
    image: '/feature-item.jpg',
  },
  {
    no: '7',
    title: '音楽・BGM',
    text: 'その世界に流れていそうなBGMタイトルや歌詞っぽい空気。',
    image: '/feature-music.jpg',
  },
];

const presets = ['1999年の夏', '地方の海辺', '高校2年生', '内向的', '音楽が好き', '夕暮れ'];

function App() {
  const [input, setInput] = useState<StoryInput>({
    era: '1999年・夏',
    place: '海沿いの地方町',
    role: '高校2年生',
    mood: '少し切ない',
  });

  const generatedText = useMemo(() => {
    return `もし、${input.era}に${input.place}で${input.role}として生きていたら。\n${input.mood}空気の中で、存在しなかったはずの写真、会話、日記が少しずつ立ち上がります。`;
  }, [input]);

  const updateInput = (key: keyof StoryInput, value: string) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <main className="page-shell">
      <section className="hero-section">
        <div className="hero-bg" />
        <div className="hero-content">
          <p className="eyebrow">あったかもしれないGPT</p>
          <h1>存在しなかったはずの人生を、AIがまるごと生成する。</h1>
          <p className="hero-lead">
            写真、LINE、SNS、検索履歴、日記、思い出の品まで。あなたの「もしも」の世界線を、
            触れる記憶のように体験できます。
          </p>
          <div className="hero-actions">
            <a href="#generator" className="primary-button">世界線を作ってみる</a>
            <a href="#features" className="secondary-button">生成される内容を見る</a>
          </div>
        </div>

        <div className="phone-mock">
          <div className="phone-top" />
          <div className="phone-screen">
            <p className="phone-label">1999年・夏</p>
            <h2>高校2年生のわたし</h2>
            <div className="phone-photo" />
            <p className="phone-copy">存在しないのに、なぜか懐かしい。</p>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-heading">
          <p className="eyebrow">Generated Contents</p>
          <h2>生成される7つの記憶ログ</h2>
          <p>単発のAI画像ではなく、ひとつの人生としてつながる体験を作ります。</p>
        </div>

        <div className="features-grid">
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

      <section id="generator" className="generator-section">
        <div className="generator-card">
          <div>
            <p className="eyebrow">Try Demo</p>
            <h2>あなたの世界線を入力</h2>
            <p className="muted">まずは雰囲気を入れるだけ。あとでOpenAI APIにつなげて本生成できます。</p>
          </div>

          <div className="form-grid">
            <label>
              時代
              <input value={input.era} onChange={(e) => updateInput('era', e.target.value)} />
            </label>
            <label>
              場所
              <input value={input.place} onChange={(e) => updateInput('place', e.target.value)} />
            </label>
            <label>
              役割
              <input value={input.role} onChange={(e) => updateInput('role', e.target.value)} />
            </label>
            <label>
              空気感
              <input value={input.mood} onChange={(e) => updateInput('mood', e.target.value)} />
            </label>
          </div>

          <div className="preset-row">
            {presets.map((preset) => (
              <span key={preset}>{preset}</span>
            ))}
          </div>
        </div>

        <div className="result-card">
          <p className="eyebrow">Preview</p>
          <h2>生成プレビュー</h2>
          <p>{generatedText}</p>
          <div className="result-tabs">
            <span>写真</span>
            <span>LINE</span>
            <span>SNS</span>
            <span>日記</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
