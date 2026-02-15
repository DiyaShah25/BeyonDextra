import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Answer {
  id: string;
  answer_text: string;
  is_correct: boolean;
  order_index: number;
}

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  order_index: number;
  points: number;
  answers: Answer[];
}

interface Quiz {
  id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  passing_score: number;
  time_limit_minutes: number | null;
  questions: Question[];
}

interface QuizAttempt {
  id: string;
  quiz_id: string;
  score: number;
  max_score: number;
  passed: boolean;
  started_at: string;
  completed_at: string | null;
}

interface SelectedAnswers {
  [questionId: string]: string;
}

export function useQuiz(lessonId: string | undefined) {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lessonId) {
      fetchQuizData();
    }
  }, [lessonId, user]);

  const fetchQuizData = async () => {
    if (!lessonId) return;
    
    setLoading(true);
    setError(null);

    try {
      // Fetch quiz for this lesson
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', lessonId)
        .maybeSingle();

      if (quizError) throw quizError;

      if (!quizData) {
        setQuiz(null);
        setLoading(false);
        return;
      }

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizData.id)
        .order('order_index');

      if (questionsError) throw questionsError;

      // Fetch answers using student view (hides is_correct field)
      const questionIds = questionsData.map(q => q.id);
      const { data: answersData, error: answersError } = await (supabase as any)
        .from('quiz_answers_student')
        .select('id, question_id, answer_text, order_index')
        .in('question_id', questionIds)
        .order('order_index');

      if (answersError) throw answersError;

      // Organize answers by question (is_correct is hidden from students)
      const questionsWithAnswers = questionsData.map(question => ({
        ...question,
        points: question.points || 1,
        answers: (answersData || []).filter((a: any) => a.question_id === question.id).map((a: any) => ({
          ...a,
          is_correct: false, // Hidden from client - scoring done server-side via submitQuiz
        })),
      }));

      setQuiz({
        ...quizData,
        passing_score: quizData.passing_score || 70,
        questions: questionsWithAnswers,
      });

      // Fetch previous attempt if user is logged in
      if (user) {
        const { data: attemptData } = await supabase
          .from('quiz_attempts')
          .select('*')
          .eq('quiz_id', quizData.id)
          .eq('user_id', user.id)
          .maybeSingle();

        setAttempt(attemptData);
      }
    } catch (err) {
      console.error('Error fetching quiz data:', err);
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const submitQuiz = async () => {
    if (!user || !quiz) return { error: 'Not authenticated or no quiz' };

    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('No session token');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/submit-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          quiz_id: quiz.id,
          selected_answers: selectedAnswers,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to submit quiz');

      setAttempt(result.attempt);
      return { error: null, score: result.score, maxScore: result.maxScore, passed: result.passed };
    } catch (err) {
      console.error('Error submitting quiz:', err);
      return { error: 'Failed to submit quiz' };
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setAttempt(null);
  };

  const isAllAnswered = () => {
    return quiz?.questions.every(q => selectedAnswers[q.id]) || false;
  };

  return {
    quiz,
    attempt,
    selectedAnswers,
    loading,
    submitting,
    error,
    selectAnswer,
    submitQuiz,
    resetQuiz,
    isAllAnswered,
    refetch: fetchQuizData,
  };
}
