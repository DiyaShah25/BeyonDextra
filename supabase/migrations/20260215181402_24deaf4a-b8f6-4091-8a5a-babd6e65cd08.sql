
-- Fix the security definer view by making it use invoker's permissions
DROP VIEW IF EXISTS public.quiz_answers_student;
CREATE VIEW public.quiz_answers_student
WITH (security_invoker = true) AS
SELECT id, question_id, answer_text, order_index
FROM public.quiz_answers;
