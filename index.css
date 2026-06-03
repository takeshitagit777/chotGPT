import type { ChatMessage, Worldline } from './types';
import { defaultWorldline } from './defaultWorld';

const WORLDLINE_KEY = 'kaku-jibunshi-worldline';
const MESSAGE_KEY = 'kaku-jibunshi-messages';

export function getWorldline(): Worldline {
  try {
    const raw = localStorage.getItem(WORLDLINE_KEY);
    if (!raw) return defaultWorldline;
    return { ...defaultWorldline, ...JSON.parse(raw) };
  } catch {
    return defaultWorldline;
  }
}

export function saveWorldline(worldline: Worldline) {
  localStorage.setItem(WORLDLINE_KEY, JSON.stringify(worldline));
}

export function getMessages(friendId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[friendId] ?? [];
  } catch {
    return [];
  }
}

export function saveMessages(friendId: string, messages: ChatMessage[]) {
  const raw = localStorage.getItem(MESSAGE_KEY);
  const all = raw ? JSON.parse(raw) : {};
  all[friendId] = messages;
  localStorage.setItem(MESSAGE_KEY, JSON.stringify(all));
}

export function clearWorldline() {
  localStorage.removeItem(WORLDLINE_KEY);
  localStorage.removeItem(MESSAGE_KEY);
}
