import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, CheckCircle2,
  FileText, MessageSquare, Download, Bookmark, ThumbsUp,
  Clock, BarChart3, ListChecks, Loader2
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { QuizPlayer } from '@/components/quiz/QuizPlayer';
import { useCourseData } from '@/hooks/useCourseData';
import { useToast } from '@/hooks/use-toast';

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    course, 
    enrollment, 
    lessonProgress, 
    loading,
    markLessonComplete,
    updateWatchTime,
    getCompletedLessonsCount,
    getTotalLessonsCount,
  } = useCourseData(courseId);

  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  useEffect(() => {
    if (course && lessonId) {
      // Find the lesson and its position
      for (let mIdx = 0; mIdx < course.modules.length; mIdx++) {
        const module = course.modules[mIdx];
        for (let lIdx = 0; lIdx < module.lessons.length; lIdx++) {
          if (module.lessons[lIdx].id === lessonId) {
            setCurrentLesson(module.lessons[lIdx]);
            setCurrentModuleIndex(mIdx);
            setCurrentLessonIndex(lIdx);
            return;
          }
        }
      }
    }
  }, [course, lessonId]);

  const handleProgress = (seconds: number) => {
    if (lessonId) {
      updateWatchTime(lessonId, seconds);
    }
  };

  const handleVideoComplete = async () => {
    if (lessonId) {
      const { error } = await markLessonComplete(lessonId);
      if (!error) {
        toast({
          title: 'Lesson completed!',
          description: 'Great job! Keep up the good work.',
        });
      }
    }
  };

  const handleMarkComplete = async () => {
    if (lessonId) {
      const { error } = await markLessonComplete(lessonId);
      if (error) {
        toast({
          title: 'Error',
          description: error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Lesson completed!',
          description: 'Great job! Keep up the good work.',
        });
      }
    }
  };

  const navigateToLesson = (direction: 'prev' | 'next') => {
    if (!course) return;

    let newModuleIdx = currentModuleIndex;
    let newLessonIdx = currentLessonIndex;

    if (direction === 'next') {
      if (currentLessonIndex < course.modules[currentModuleIndex].lessons.length - 1) {
        newLessonIdx++;
      } else if (currentModuleIndex < course.modules.length - 1) {
        newModuleIdx++;
        newLessonIdx = 0;
      } else {
        return; // At the end
      }
    } else {
      if (currentLessonIndex > 0) {
        newLessonIdx--;
      } else if (currentModuleIndex > 0) {
        newModuleIdx--;
        newLessonIdx = course.modules[newModuleIdx].lessons.length - 1;
      } else {
        return; // At the beginning
      }
    }

    const newLesson = course.modules[newModuleIdx].lessons[newLessonIdx];
    navigate(`/courses/${courseId}/lessons/${newLesson.id}`);
  };

  const getAllLessons = () => {
    if (!course) return [];
    return course.modules.flatMap((m, mIdx) => 
      m.lessons.map((l, lIdx) => ({ 
        ...l, 
        moduleIndex: mIdx, 
        lessonIndex: lIdx,
        moduleTitle: m.title 
      }))
    );
  };

  if (loading) {
    return (
      <Layout hideFooter>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!course || !currentLesson) {
    return (
      <Layout hideFooter>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
          <Button asChild>
            <Link to={`/courses/${courseId}`}>Back to Course</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const isCompleted = lessonProgress.get(lessonId!)?.completed;
  const allLessons = getAllLessons();
  const completedCount = getCompletedLessonsCount();
  const totalCount = getTotalLessonsCount();

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-background">
        {/* Top Navigation */}
        <div className="bg-card border-b border-border sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link 
                  to={`/courses/${courseId}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="sr-only sm:not-sr-only">Back to Course</span>
                </Link>
                <div>
                  <h1 className="font-semibold text-foreground">{currentLesson.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    {course.modules[currentModuleIndex].title}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isCompleted && (
                  <Button variant="outline" size="sm" onClick={handleMarkComplete}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
                {isCompleted && (
                  <span className="flex items-center gap-1 text-success text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <VideoPlayer
                  src={currentLesson.content_url}
                  title={currentLesson.title}
                  onProgress={handleProgress}
                  onComplete={handleVideoComplete}
                  initialTime={lessonProgress.get(lessonId!)?.watch_time_seconds || 0}
                />
              </motion.div>

              {/* Tabs Section */}
              <Tabs defaultValue="transcript" className="w-full">
                <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-lg">
                  <TabsTrigger value="transcript" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Transcript
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Resources
                  </TabsTrigger>
                  <TabsTrigger value="quiz" className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4" />
                    Quiz
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="transcript" className="mt-4">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Lesson Transcript</h3>
                    </div>
                    <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                      {currentLesson.transcript || 'No transcript available for this lesson.'}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="mt-4">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold mb-4">Downloadable Resources</h3>
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No resources available for this lesson.</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="quiz" className="mt-4">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <QuizPlayer 
                      lessonId={lessonId!}
                      onComplete={(passed) => {
                        if (passed) {
                          markLessonComplete(lessonId!);
                        }
                      }}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Lesson List */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border sticky top-20">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold">Course Lessons</h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <BarChart3 className="w-4 h-4" />
                    <span>{completedCount} of {totalCount} completed</span>
                  </div>
                  <Progress value={(completedCount / totalCount) * 100} className="mt-2" />
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {allLessons.map((lesson, idx) => {
                    const isCurrent = lesson.id === lessonId;
                    const isLessonCompleted = lessonProgress.get(lesson.id)?.completed;
                    
                    return (
                      <Link
                        key={lesson.id}
                        to={`/courses/${courseId}/lessons/${lesson.id}`}
                        className={`flex items-start gap-3 p-4 border-b border-border last:border-b-0 transition-colors ${
                          isCurrent ? 'bg-primary/10' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                          isLessonCompleted ? 'bg-success text-success-foreground' : 
                          isCurrent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {isLessonCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-medium">{idx + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm ${isCurrent ? 'text-primary' : ''}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{lesson.duration_minutes || 0} min</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      size="sm"
                      onClick={() => navigateToLesson('prev')}
                      disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    <Button 
                      className="flex-1" 
                      size="sm"
                      onClick={() => navigateToLesson('next')}
                      disabled={
                        currentModuleIndex === course.modules.length - 1 && 
                        currentLessonIndex === course.modules[currentModuleIndex].lessons.length - 1
                      }
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
