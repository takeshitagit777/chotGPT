import { Link } from 'react-router-dom';
import { getWorldline } from '../lib/storage';

function FriendsPage() {
  const worldline = getWorldline();

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
            <Link to={`/chat/${friend.id}`} className="friend-item" key={friend.id}>
              <div className="friend-avatar">{friend.avatar}</div>
              <div className="friend-main">
                <div className="friend-name-row">
                  <strong>{friend.name}</strong>
                  <span>{friend.relationship}</span>
                </div>
                <p>{friend.latestMessage}</p>
              </div>
              {friend.unread ? <span className="unread-badge">{friend.unread}</span> : <span className="chevron">›</span>}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default FriendsPage;
