export type Character = {
  id: string;
  name: string;
  relationship: string;
  age: string;
  personality: string;
  speakingStyle: string;
  backstory: string;
  avatar: string;
  latestMessage: string;
  unread?: number;
};

export type Photo = {
  id: string;
  title: string;
  caption: string;
  date: string;
  imageUrl: string;
};

export type Album = {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  photos: Photo[];
};

export type Worldline = {
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

export type ChatMessage = {
  id: string;
  friendId: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
};
