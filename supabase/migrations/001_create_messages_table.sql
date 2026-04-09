CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(50) NOT NULL DEFAULT '匿名用户',
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  avatar_seed VARCHAR(20) NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_pinned BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Messages are publicly readable"
  ON messages FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert messages"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION increment_likes(message_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  new_likes INTEGER;
BEGIN
  UPDATE messages
  SET likes = likes + 1
  WHERE id = message_id
  RETURNING likes INTO new_likes;

  RETURN new_likes;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_likes(UUID) TO anon;
