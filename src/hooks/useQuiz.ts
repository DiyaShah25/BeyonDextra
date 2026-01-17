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

      // Fetch answers for all questions
      const questionIds = questionsData.map(q => q.id);
      const { data: answersData, error: answersError } = await supabase
        .from('quiz_answers')
        .select('*')
        .in('question_id', questionIds)
        .order('order_index');

      if (answersError) throw answersError;

      // Organize answers by question
      const questionsWithAnswers = questionsData.map(question => ({
        ...question,
        points: question.points || 1,
        answers: answersData.filter(a => a.question_id === question.id),
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
      // Calculate score
      let score = 0;
      let maxScore = 0;

      quiz.questions.forEach(question => {
        maxScore += question.points;
        const selectedAnswerId = selectedAnswers[question.id];
        const correctAnswer = question.answers.find(a => a.is_correct);
        if (selectedAnswerId && correctAnswer && selectedAnswerId === correctAnswer.id) {
          score += question.points;
        }
      });

      const passed = (score / maxScore) * 100 >= quiz.passing_score;

      // Create or update attempt
      const { data: attemptData, error: attemptError } = await supabase
        .from('quiz_attempts')
        .upsert({
          user_id: user.id,
          quiz_id: quiz.id,
          score,
          max_score: maxScore,
          passed,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (attemptError) throw attemptError;

      // Save individual responses
      const responses = Object.entries(selectedAnswers).map(([questionId, answerId]) => {
        const question = quiz.questions.find(q => q.id === questionId);
        const correctAnswer = question?.answers.find(a => a.is_correct);
        return {
          attempt_id: attemptData.id,
          question_id: questionId,
          selected_answer_id: answerId,
          is_correct: correctAnswer?.id === answerId,
        };
      });

      if (responses.length > 0) {
        await supabase.from('quiz_responses').insert(responses);
      }

      setAttempt(attemptData);
      return { error: null, score, maxScore, passed };
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
