export interface DiaryEntry {
  id: string;
  title: string;
  author: string;
  date: string;
  thumbnailColor: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderColor: string;
  text: string;
  isMe: boolean;
  time?: string;
  readCount?: number;
}

export interface RoomInfo {
  id: string;
  name: string;
  code: string;
  memberCount: number;
  memberColors: string[];
}

export type RoomView = 'diary' | 'chat';
