
-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Quiz answers viewable by instructors or after completion" ON public.quiz_answers;

-- Instructors can view all answer details for their courses
CREATE POLICY "Instructors can view all answer details"
ON public.quiz_answers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM quiz_questions qq
    JOIN quizzes q ON q.id = qq.quiz_id
    JOIN lessons l ON l.id = q.lesson_id
    JOIN modules m ON m.id = l.module_id
    JOIN courses c ON c.id = m.course_id
    WHERE qq.id = quiz_answers.question_id
    AND c.instructor_id = auth.uid()
  )
);

-- Students can view answers only after completing the quiz
CREATE POLICY "Students can view answers after quiz completion"
ON public.quiz_answers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM quiz_questions qq
    JOIN quizzes q ON q.id = qq.quiz_id
    JOIN quiz_attempts qa ON qa.quiz_id = q.id
    WHERE qq.id = quiz_answers.question_id
    AND qa.user_id = auth.uid()
    AND qa.completed_at IS NOT NULL
  )
);
