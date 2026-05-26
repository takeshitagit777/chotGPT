import type { Character, ChatMessage, Worldline } from './types';

export async function createWorldline(input: {
  era: string;
  place: string;
  role: string;
  mood: string;
}) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || data?.error || '生成に失敗しました。');
  }

  return data as {
    result: Worldline;
    remaining?: number;
    limit?: number;
  };
}

export async function sendChatMessage(input: {
  worldline: Worldline;
  character: Character;
  history: ChatMessage[];
  message: string;
}) {
  const res = await fetch('/api/chat-send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || data?.error || '返信の生成に失敗しました。');
  }

  return data as {
    reply: string;
  };
}
