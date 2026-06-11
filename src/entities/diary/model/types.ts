export interface DiaryEntry {
  id: string;
  title: string;
  author: string;
  date: string;
  thumbnailColor: string;
}

export interface DiaryComment {
  id: string;
  authorName: string;
  authorColor: string;
  text: string;
  timeLabel: string;
}

export interface DiaryDetail extends DiaryEntry {
  authorColor: string;
  fullDate: string;
  roomName: string;
  content: string;
  imageCount: number;
  photoColors: string[];
  extraPhotoCount: number;
  comments: DiaryComment[];
}
