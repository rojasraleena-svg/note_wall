export interface Message {
  id: string;
  nickname: string;
  content: string;
  avatar_seed: string;
  likes: number;
  created_at: string;
  is_pinned: boolean;
}

export interface CreateMessageInput {
  nickname?: string;
  content: string;
}
