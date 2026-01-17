import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Users, 
  Star, 
  CheckCircle2, 
  Play,
  BookOpen,
  Award,
  ArrowLeft,
  ChevronDown,
  Video,
  FileText,
  HelpCircle,
  Lock,
  Loader2
} from 'lucide-react';
import { useCourseData } from '@/hooks/useCourseData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const lessonTypeIcons = {
  video: Video,
  quiz: HelpCircle,
  project: FileText,
  text: FileText,
};

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    course, 
    enrollment, 
    lessonProgress, 
    loading, 
    enrollInCourse,
    getCompletedLessonsCount,
    getTotalLessonsCount,
  } = useCourseData(courseId);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const { error } = await enrollInCourse();
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Enrolled!',
        description: 'You are now enrolled in this course.',
      });
    }
  };

  const handleLessonClick = (lessonId: string, moduleIndex: number, lessonIndex: number) => {
    if (!enrollment && !user) {
      toast({
        title: 'Enroll to access',
        description: 'Please enroll in the course to access lessons.',
      });
      return;
    }
    navigate(`/courses/${courseId}/lessons/${lessonId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const totalLessons = getTotalLessonsCount();
  const completedLessons = getCompletedLessonsCount();
  const progressPercent = enrollment?.progress_percent || 0;

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/courses" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="badge-primary">{course.difficulty || 'All Levels'}</span>
                {course.is_published && (
                  <span className="badge-success">Published</span>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
                {course.title}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {course.duration_hours || 0} hours
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  {totalLessons} lessons
                </span>
              </div>

              {enrollment && (
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {completedLessons} / {totalLessons} lessons
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {progressPercent}% complete
                  </p>
                </div>
              )}
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="card-elevated sticky top-24">
                {course.thumbnail_url ? (
                  <img 
                    src={course.thumbnail_url} 
                    alt={course.title}
                    className="aspect-video bg-muted rounded-lg mb-6 object-cover"
                  />
                ) : (
                  <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                    <Play className="w-12 h-12 text-primary relative z-10" />
                  </div>
                )}
                
                <p className="text-3xl font-bold mb-2">
                  {course.price && course.price > 0 ? `$${course.price}` : 'Free'}
                </p>
                <p className="text-muted-foreground text-sm mb-6">
                  {course.price && course.price > 0 ? 'One-time purchase' : 'Full access to all content'}
                </p>

                {enrollment ? (
                  <Button 
                    className="w-full mb-4" 
                    size="lg"
                    onClick={() => {
                      const firstLesson = course.modules[0]?.lessons[0];
                      if (firstLesson) {
                        navigate(`/courses/${courseId}/lessons/${firstLesson.id}`);
                      }
                    }}
                  >
                    Continue Learning
                  </Button>
                ) : (
                  <Button className="w-full mb-4" size="lg" onClick={handleEnroll}>
                    {course.price && course.price > 0 ? 'Buy Now' : "Enroll Now - It's Free"}
                  </Button>
                )}

                <div className="mt-6 pt-6 border-t border-border space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{course.duration_hours || 0} hours of content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span>{totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:max-w-3xl">
            <h2 className="text-2xl font-display font-bold mb-6">Course Content</h2>
            <p className="text-muted-foreground mb-6">
              {course.modules.length} modules • {totalLessons} lessons • {course.duration_hours || 0} hours total
            </p>

            <div className="space-y-4">
              {course.modules.map((module, moduleIdx) => (
                <details key={module.id} className="group card-elevated" open={moduleIdx === 0}>
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {moduleIdx + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {module.lessons.length} lessons
                        </p>
                      </div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                  </summary>
                  
                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    {module.lessons.map((lesson, lessonIdx) => {
                      const Icon = lessonTypeIcons[lesson.content_type as keyof typeof lessonTypeIcons] || Video;
                      const isCompleted = lessonProgress.get(lesson.id)?.completed;
                      const isLocked = !enrollment && !user;
                      
                      return (
                        <motion.div 
                          key={lesson.id}
                          whileHover={{ x: 4 }}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                            isCompleted ? 'bg-success/10' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => handleLessonClick(lesson.id, moduleIdx, lessonIdx)}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : (
                            <Icon className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="flex-1">{lesson.title}</span>
                          {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                          {lesson.duration_minutes && (
                            <span className="text-sm text-muted-foreground">
                              {lesson.duration_minutes} min
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
