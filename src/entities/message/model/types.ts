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
