import { Route, Routes, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import HomePage from './pages/HomePage';
import FriendsPage from './pages/FriendsPage';
import ChatPage from './pages/ChatPage';
import AlbumsPage from './pages/AlbumsPage';
import AlbumDetailPage from './pages/AlbumDetailPage';

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/chat/:friendId" element={<ChatPage />} />
        <Route path="/albums" element={<AlbumsPage />} />
        <Route path="/albums/:albumId" element={<AlbumDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
