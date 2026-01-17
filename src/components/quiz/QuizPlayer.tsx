import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuiz } from '@/hooks/useQuiz';

interface QuizPlayerProps {
  lessonId: string;
  onComplete?: (passed: boolean) => void;
}

export function QuizPlayer({ lessonId, onComplete }: QuizPlayerProps) {
  const {
    quiz,
    attempt,
    selectedAnswers,
    loading,
    submitting,
    selectAnswer,
    submitQuiz,
    resetQuiz,
    isAllAnswered,
  } = useQuiz(lessonId);

  const handleSubmit = async () => {
    const result = await submitQuiz();
    if (!result.error && onComplete) {
      onComplete(result.passed || false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No quiz available for this lesson.</p>
      </div>
    );
  }

  // Show results if already completed
  if (attempt?.completed_at) {
    const percentage = Math.round((attempt.score / attempt.max_score) * 100);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
          attempt.passed ? 'bg-success/20' : 'bg-destructive/20'
        }`}>
          {attempt.passed ? (
            <Trophy className="w-12 h-12 text-success" />
          ) : (
            <XCircle className="w-12 h-12 text-destructive" />
          )}
        </div>

        <h3 className="text-2xl font-bold mb-2">
          {attempt.passed ? 'Congratulations!' : 'Keep Trying!'}
        </h3>
        
        <p className="text-muted-foreground mb-4">
          You scored {attempt.score} out of {attempt.max_score} ({percentage}%)
        </p>

        <Progress value={percentage} className="max-w-xs mx-auto mb-6" />

        <p className="text-sm text-muted-foreground mb-6">
          {attempt.passed 
            ? 'You passed the quiz! Great job understanding the material.'
            : `You need ${quiz.passing_score}% to pass. Review the lesson and try again.`}
        </p>

        {!attempt.passed && (
          <Button onClick={resetQuiz} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Retry Quiz
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{quiz.title}</h3>
        <span className="text-sm text-muted-foreground">
          {Object.keys(selectedAnswers).length} / {quiz.questions.length} answered
        </span>
      </div>

      {quiz.description && (
        <p className="text-muted-foreground text-sm">{quiz.description}</p>
      )}

      <Progress 
        value={(Object.keys(selectedAnswers).length / quiz.questions.length) * 100} 
        className="h-2"
      />

      <div className="space-y-6">
        {quiz.questions.map((question, qIndex) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: qIndex * 0.1 }}
            className="p-4 bg-muted/50 rounded-lg"
          >
            <p className="font-medium mb-3">
              {qIndex + 1}. {question.question_text}
            </p>
            <div className="space-y-2">
              {question.answers.map((answer) => {
                const isSelected = selectedAnswers[question.id] === answer.id;
                
                return (
                  <label
                    key={answer.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-background hover:bg-primary/5 border-2 border-transparent'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={isSelected}
                      onChange={() => selectAnswer(question.id, answer.id)}
                      className="w-4 h-4 text-primary"
                    />
                    <span>{answer.answer_text}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
                    )}
                  </label>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!isAllAnswered() || submitting}
        className="w-full"
        size="lg"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Answers'
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        You need {quiz.passing_score}% to pass this quiz
      </p>
    </div>
  );
}
