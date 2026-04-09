import { supabase } from "@/lib/supabase";
import { Message, CreateMessageInput } from "@/types/message";

function generateAvatarSeed(): string {
  return Math.random().toString(36).substring(2, 10);
}

export async function fetchMessages(
  page: number = 1,
  pageSize: number = 20
): Promise<{ data: Message[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const [countResult, dataResult] = await Promise.all([
    supabase.from("messages").select("*", { count: "exact", head: true }),
    supabase
      .from("messages")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .range(from, to),
  ]);

  if (dataResult.error) throw dataResult.error;
  if (countResult.error) throw countResult.error;

  return {
    data: dataResult.data as Message[],
    total: countResult.count ?? 0,
  };
}

export async function createMessage(
  input: CreateMessageInput
): Promise<Message> {
  const nickname = input.nickname?.trim() || "匿名用户";
  const content = input.content.trim();

  if (!content) {
    throw new Error("留言内容不能为空");
  }
  if (content.length > 500) {
    throw new Error("留言内容不能超过500字");
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      nickname,
      content,
      avatar_seed: generateAvatarSeed(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

export async function incrementLikes(messageId: string): Promise<number> {
  const { data, error } = await supabase.rpc("increment_likes", {
    message_id: messageId,
  });

  if (error) throw error;
  // Supabase v2 wraps scalar RPC returns in arrays, e.g., [1]
  const raw = data as number | number[];
  return Array.isArray(raw) ? raw[0] : raw;
}
