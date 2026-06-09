export interface RoomInfo {
  id: string;
  name: string;
  code: string;
  memberCount: number;
  memberColors: string[];
}

export interface RoomMember {
  id: string;
  name: string;
  color: string;
  isMe?: boolean;
}
