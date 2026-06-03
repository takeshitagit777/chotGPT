import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { createWorldline } from '../lib/api';
import { defaultWorldline } from '../lib/defaultWorld';
import { getWorldline, saveWorldline } from '../lib/storage';
import type { Worldline } from '../lib/types';

const features = [
  { no: '1', title: '写真・アルバム', text: '存在しない写真が、まるで古いアルバムのように並びます。', image: '/feature-album.jpg', to: '/albums' },
  { no: '2', title: '会話の記録', text: '友達一覧から相手を選び、その世界線の中で会話できます。', image: '/feature-line.jpg', to: '/friends' },
  { no: '3', title: 'SNS投稿', text: '当時っぽい投稿、コメント、いいねまで自分史の断片として再現します。', image: '/feature-sns.jpg', to: '/' },
  { no: '4', title: '検索履歴', text: 'その人の人生がにじむ、妙にリアルな検索履歴。', image: '/feature-search.jpg', to: '/' },
  { no: '5', title: '日記・つぶやき', text: '誰にも見せなかったノートのような短い記録。', image: '/feature-diary.jpg', to: '/' },
  { no: '6', title: '思い出の品', text: 'ケータイ、キーホルダー、チケット。物から人生の断片を作る。', image: '/feature-item.jpg', to: '/' },
  { no: '7', title: '音楽・BGM', text: 'その世界に流れていそうなBGMタイトルや歌詞っぽい空気。', image: '/feature-music.jpg', to: '/' },
];

const presets = [
  ['1999年', '地方の海辺の町', '高校2年生', '切なくて懐かしい'],
  ['2006年', '夕方の団地', '中学生', '少し痛くて優しい'],
  ['2012年', '雪の日の駅前', '売れないバンドマン', '静かで映画っぽい'],
];

function HomePage() {
  const [era, setEra] = useState('1999年');
  const [place, setPlace] = useState('地方の海辺の町');
  const [role, setRole] = useState('高校2年生');
  const [mood, setMood] = useState('切なくて懐かしい');
  const [worldline, setWorldline] = useState<Worldline>(defaultWorldline);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [remainingCount, setRemainingCount] = useState<number | null>(null);

  useEffect(() => {
    setWorldline(getWorldline());
  }, []);

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
      const data = await createWorldline({ era, place, role, mood });

      const nextWorldline = {
        ...defaultWorldline,
        ...data.result,
        id: data.result?.id || `worldline-${Date.now()}`,
        era,
        place,
        role,
        mood,
      };

      saveWorldline(nextWorldline);
      setWorldline(nextWorldline);

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
            <Link to="/friends" className="ghost-button">会話を開く</Link>
            <Link to="/albums" className="ghost-button">アルバムを見る</Link>
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
            <Link className="feature-card" key={feature.no} to={feature.to}>
              <div className="feature-image-wrap">
                <span className="feature-no">{feature.no}</span>
                <img src={feature.image} alt={feature.title} className="feature-image" />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="create" className="section creator">
        <div className="creator-panel">
          <div>
            <p className="eyebrow">Create Your Fictional History</p>
            <h2>設定を入れるだけで、もうひとつの自分史が立ち上がる。</h2>
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
            {isGenerating ? '生成中…' : '架空自分史を生成する'}
          </button>

          {remainingCount !== null && (
            <p className="limit-text">本日の残り生成回数：{remainingCount}回</p>
          )}
          {loadingText && <p className="loading-text">{loadingText}</p>}
          {errorMessage && <p className="error-text">{errorMessage}</p>}
        </div>

        <div className="result-panel">
          <div className="result-content">
            <p className="eyebrow">Current World</p>
            <h3>{worldline.title}</h3>
            <div className="result-block"><strong>SNS投稿</strong><p>{worldline.sns}</p></div>
            <div className="result-block"><strong>検索履歴</strong><ul>{worldline.search.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
            <div className="result-block"><strong>日記</strong><p>{worldline.diary}</p></div>
            <div className="result-block"><strong>思い出の品</strong><p>{worldline.item}</p></div>
            <div className="result-block"><strong>BGM</strong><p>{worldline.bgm}</p></div>

            <div className="result-actions">
              <Link to="/friends" className="small-primary">友達一覧へ</Link>
              <Link to="/albums" className="small-ghost">アルバムへ</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
