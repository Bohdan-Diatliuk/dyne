export interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  users: {
    name: string;
    username: string;
    avatar_url: string | null;
  };
}

export interface PostCardProps {
  id: string;
  content: string;
  createdAt: string;
  author: string;
  authorName: string;
  avatarUrl?: string | null;
}
