export interface Room {
  id: string;
  name: string;
  memberColors: string[];
}

export interface PrivateDiary {
  id: string;
  name: string;
  count: number;
}

export interface DiaryEntry {
  id: string;
  title: string;
  roomName: string;
  isPrivate: boolean;
  date: Date;
}

export type ViewTab = 'list' | 'calendar';
