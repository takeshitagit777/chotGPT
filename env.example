import { NavLink, Outlet, useLocation } from 'react-router-dom';

function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className={isHome ? 'app app-home' : 'app'}>
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark">架</span>
          <span>
            <strong>架空自分史</strong>
            <small>存在しないあなたを、記録する。</small>
          </span>
        </NavLink>

        <nav className="desktop-nav">
          <NavLink to="/">ホーム</NavLink>
          <NavLink to="/friends">会話</NavLink>
          <NavLink to="/albums">アルバム</NavLink>
        </nav>
      </header>

      <Outlet />

      <nav className="bottom-nav" aria-label="メインナビゲーション">
        <NavLink to="/">
          <span>⌂</span>
          <small>ホーム</small>
        </NavLink>
        <NavLink to="/friends">
          <span>💬</span>
          <small>会話</small>
        </NavLink>
        <NavLink to="/albums">
          <span>▧</span>
          <small>アルバム</small>
        </NavLink>
      </nav>
    </div>
  );
}

export default AppShell;
