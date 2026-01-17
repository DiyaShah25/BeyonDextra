-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70,
  time_limit_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz_questions table
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  order_index INTEGER NOT NULL DEFAULT 0,
  points INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz_answers table
CREATE TABLE public.quiz_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Create quiz_attempts table
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  max_score INTEGER NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, quiz_id)
);

-- Create quiz_responses table for individual answers
CREATE TABLE public.quiz_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  selected_answer_id UUID REFERENCES public.quiz_answers(id),
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

-- Quizzes: viewable by everyone, manageable by instructors
CREATE POLICY "Quizzes are viewable by everyone"
ON public.quizzes FOR SELECT
USING (true);

CREATE POLICY "Instructors can manage quizzes"
ON public.quizzes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM lessons l
    JOIN modules m ON m.id = l.module_id
    JOIN courses c ON c.id = m.course_id
    WHERE l.id = quizzes.lesson_id AND c.instructor_id = auth.uid()
  )
);

-- Quiz questions: viewable by everyone, manageable by instructors
CREATE POLICY "Quiz questions are viewable by everyone"
ON public.quiz_questions FOR SELECT
USING (true);

CREATE POLICY "Instructors can manage quiz questions"
ON public.quiz_questions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM quizzes q
    JOIN lessons l ON l.id = q.lesson_id
    JOIN modules m ON m.id = l.module_id
    JOIN courses c ON c.id = m.course_id
    WHERE q.id = quiz_questions.quiz_id AND c.instructor_id = auth.uid()
  )
);

-- Quiz answers: viewable by everyone, manageable by instructors
CREATE POLICY "Quiz answers are viewable by everyone"
ON public.quiz_answers FOR SELECT
USING (true);

CREATE POLICY "Instructors can manage quiz answers"
ON public.quiz_answers FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM quiz_questions qq
    JOIN quizzes q ON q.id = qq.quiz_id
    JOIN lessons l ON l.id = q.lesson_id
    JOIN modules m ON m.id = l.module_id
    JOIN courses c ON c.id = m.course_id
    WHERE qq.id = quiz_answers.question_id AND c.instructor_id = auth.uid()
  )
);

-- Quiz attempts: users can manage their own
CREATE POLICY "Users can view own quiz attempts"
ON public.quiz_attempts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quiz attempts"
ON public.quiz_attempts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz attempts"
ON public.quiz_attempts FOR UPDATE
USING (auth.uid() = user_id);

-- Quiz responses: users can manage their own via attempts
CREATE POLICY "Users can view own quiz responses"
ON public.quiz_responses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM quiz_attempts qa
    WHERE qa.id = quiz_responses.attempt_id AND qa.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create own quiz responses"
ON public.quiz_responses FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM quiz_attempts qa
    WHERE qa.id = quiz_responses.attempt_id AND qa.user_id = auth.uid()
  )
);

-- Create indexes for performance
CREATE INDEX idx_quizzes_lesson_id ON public.quizzes(lesson_id);
CREATE INDEX idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);
CREATE INDEX idx_quiz_answers_question_id ON public.quiz_answers(question_id);
CREATE INDEX idx_quiz_attempts_user_quiz ON public.quiz_attempts(user_id, quiz_id);
CREATE INDEX idx_quiz_responses_attempt_id ON public.quiz_responses(attempt_id);