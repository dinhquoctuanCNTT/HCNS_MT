export interface IUserProfile {
  id: string;
  name: string;
  avatar: string;
  department: string;
}

export interface IComment {
  id: string;
  user: IUserProfile;
  content: string;
  createdAt: string;
}

export interface IPost {
  id: string;
  author: IUserProfile;
  content: string;
  createdAt: string;
  likes: number;
  comments: IComment[];
  aiSummary?: string;
}
