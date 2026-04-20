CREATE OR REPLACE FUNCTION public.increment_likes(message_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_likes INTEGER;
BEGIN
  UPDATE public.messages
  SET likes = likes + 1
  WHERE id = message_id
  RETURNING likes INTO new_likes;

  IF new_likes IS NULL THEN
    RAISE EXCEPTION 'Message not found: %', message_id
      USING ERRCODE = 'P0002';
  END IF;

  RETURN new_likes;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_likes(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_likes(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_likes(UUID) TO authenticated;
