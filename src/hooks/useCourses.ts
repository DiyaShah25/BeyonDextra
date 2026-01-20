import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  created_at: string;
  lesson_count?: number;
  module_count?: number;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch published courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      // Fetch module and lesson counts for each course
      const enrichedCourses = await Promise.all(
        (coursesData || []).map(async (course) => {
          const { data: modules } = await supabase
            .from('modules')
            .select('id')
            .eq('course_id', course.id);

          const moduleIds = modules?.map(m => m.id) || [];
          let lessonCount = 0;

          if (moduleIds.length > 0) {
            const { count } = await supabase
              .from('lessons')
              .select('*', { count: 'exact', head: true })
              .in('module_id', moduleIds);
            lessonCount = count || 0;
          }

          return {
            ...course,
            module_count: moduleIds.length,
            lesson_count: lessonCount,
          };
        })
      );

      setCourses(enrichedCourses);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses,
  };
}
