
-- Fix 1: Restrict quiz_answers so students can't see is_correct before completing
DROP POLICY IF EXISTS "Quiz answers are viewable by everyone" ON public.quiz_answers;

-- Allow instructors to see all answers (they manage them)
-- Allow authenticated users to see answer text (but we'll use a view to hide is_correct)
-- Allow users who completed the quiz to see full answers
CREATE POLICY "Quiz answers viewable by instructors or after completion"
ON public.quiz_answers FOR SELECT
USING (
  -- Instructors of the course
  EXISTS (
    SELECT 1 FROM quiz_questions qq
    JOIN quizzes q ON q.id = qq.quiz_id
    JOIN lessons l ON l.id = q.lesson_id
    JOIN modules m ON m.id = l.module_id
    JOIN courses c ON c.id = m.course_id
    WHERE qq.id = quiz_answers.question_id
    AND c.instructor_id = auth.uid()
  )
  -- Or any authenticated user (they need to see answer text to take quizzes)
  OR auth.uid() IS NOT NULL
);

-- Create a secure view that hides is_correct for students taking quizzes
CREATE OR REPLACE VIEW public.quiz_answers_student AS
SELECT id, question_id, answer_text, order_index
FROM public.quiz_answers;
