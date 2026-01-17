import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content_url: string | null;
  content_type: string | null;
  duration_minutes: number | null;
  order_index: number;
  transcript: string | null;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  difficulty: string | null;
  duration_hours: number | null;
  price: number | null;
  is_published: boolean | null;
  instructor_id: string | null;
  category_id: string | null;
  modules: Module[];
}

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  watch_time_seconds: number | null;
}

interface Enrollment {
  id: string;
  course_id: string;
  progress_percent: number | null;
  enrolled_at: string;
  completed_at: string | null;
}

export function useCourseData(courseId: string | undefined) {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Map<string, LessonProgress>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, user]);

  const fetchCourseData = async () => {
    if (!courseId) return;
    
    setLoading(true);
    setError(null);

    try {
      // Fetch course with modules and lessons
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      // Fetch modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (modulesError) throw modulesError;

      // Fetch lessons for all modules
      const moduleIds = modulesData.map(m => m.id);
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .in('module_id', moduleIds)
        .order('order_index');

      if (lessonsError) throw lessonsError;

      // Organize lessons by module
      const modulesWithLessons = modulesData.map(module => ({
        ...module,
        lessons: lessonsData.filter(l => l.module_id === module.id),
      }));

      setCourse({
        ...courseData,
        modules: modulesWithLessons,
      });

      // Fetch enrollment if user is logged in
      if (user) {
        const { data: enrollmentData } = await supabase
          .from('enrollments')
          .select('*')
          .eq('course_id', courseId)
          .eq('user_id', user.id)
          .maybeSingle();

        setEnrollment(enrollmentData);

        // Fetch lesson progress
        const lessonIds = lessonsData.map(l => l.id);
        if (lessonIds.length > 0) {
          const { data: progressData } = await supabase
            .from('lesson_progress')
            .select('*')
            .eq('user_id', user.id)
            .in('lesson_id', lessonIds);

          if (progressData) {
            const progressMap = new Map<string, LessonProgress>();
            progressData.forEach(p => {
              progressMap.set(p.lesson_id, {
                lesson_id: p.lesson_id,
                completed: p.completed || false,
                watch_time_seconds: p.watch_time_seconds,
              });
            });
            setLessonProgress(progressMap);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching course data:', err);
      setError('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async () => {
    if (!user || !courseId) return { error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress_percent: 0,
        })
        .select()
        .single();

      if (error) throw error;
      setEnrollment(data);
      return { error: null };
    } catch (err) {
      console.error('Error enrolling:', err);
      return { error: 'Failed to enroll' };
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Update local state
      setLessonProgress(prev => {
        const newMap = new Map(prev);
        newMap.set(lessonId, {
          lesson_id: lessonId,
          completed: true,
          watch_time_seconds: prev.get(lessonId)?.watch_time_seconds || 0,
        });
        return newMap;
      });

      // Update enrollment progress
      await updateEnrollmentProgress();

      return { error: null };
    } catch (err) {
      console.error('Error marking lesson complete:', err);
      return { error: 'Failed to update progress' };
    }
  };

  const updateWatchTime = async (lessonId: string, seconds: number) => {
    if (!user) return;

    try {
      await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          watch_time_seconds: seconds,
        });
    } catch (err) {
      console.error('Error updating watch time:', err);
    }
  };

  const updateEnrollmentProgress = async () => {
    if (!user || !courseId || !course) return;

    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const completedLessons = Array.from(lessonProgress.values()).filter(p => p.completed).length;
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    try {
      await supabase
        .from('enrollments')
        .update({ 
          progress_percent: progressPercent,
          completed_at: progressPercent === 100 ? new Date().toISOString() : null,
        })
        .eq('course_id', courseId)
        .eq('user_id', user.id);

      setEnrollment(prev => prev ? { ...prev, progress_percent: progressPercent } : null);
    } catch (err) {
      console.error('Error updating enrollment progress:', err);
    }
  };

  const getCompletedLessonsCount = () => {
    return Array.from(lessonProgress.values()).filter(p => p.completed).length;
  };

  const getTotalLessonsCount = () => {
    return course?.modules.reduce((sum, m) => sum + m.lessons.length, 0) || 0;
  };

  return {
    course,
    enrollment,
    lessonProgress,
    loading,
    error,
    enrollInCourse,
    markLessonComplete,
    updateWatchTime,
    getCompletedLessonsCount,
    getTotalLessonsCount,
    refetch: fetchCourseData,
  };
}
