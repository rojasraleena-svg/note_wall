DELETE FROM public.messages
WHERE nickname = 'connectivity-check'
  AND content LIKE 'temporary%';

UPDATE public.messages
SET nickname = '匿名用户'
WHERE nickname = '鍖垮悕鐢ㄦ埛';

ALTER TABLE public.messages
ALTER COLUMN nickname SET DEFAULT '匿名用户';
