import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const courses = [
  {
    id: 'course-1',
    title: 'Web Development Fundamentals',
    description: 'Learn HTML, CSS, and JavaScript with full accessibility support.',
    instructor: 'Sarah Chen',
    thumbnail: '/placeholder.svg',
    duration: '12 hours',
    students: 3420,
    rating: 4.9,
    level: 'beginner',
    category: 'Technology',
    accessibilityFeatures: ['Captions', 'Sign Language', 'Audio Description'],
  },
  {
    id: 'course-2',
    title: 'Data Science for Everyone',
    description: 'Master data analysis with Python in an inclusive learning environment.',
    instructor: 'Dr. James Miller',
    thumbnail: '/placeholder.svg',
    duration: '20 hours',
    students: 2180,
    rating: 4.8,
    level: 'intermediate',
    category: 'Data',
    accessibilityFeatures: ['Captions', 'Transcripts', 'Simplified Mode'],
  },
  {
    id: 'course-3',
    title: 'Digital Marketing Mastery',
    description: 'Build marketing skills with adaptive learning paths.',
    instructor: 'Maria Garcia',
    thumbnail: '/placeholder.svg',
    duration: '15 hours',
    students: 4560,
    rating: 4.9,
    level: 'beginner',
    category: 'Business',
    accessibilityFeatures: ['Captions', 'Text Alternatives', 'Voice Navigation'],
  },
];

const levelColors = {
  beginner: 'bg-success/10 text-success',
  intermediate: 'bg-warning/10 text-warning-foreground',
  advanced: 'bg-accent/10 text-accent',
};

export function CoursesSection() {
  const { settings } = useAccessibility();

  return (
    <section 
      className="section-padding"
      aria-labelledby="courses-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: settings.reduceMotion ? 0 : 0.5 }}
              className="badge-secondary mb-4"
            >
              Featured Courses
            </motion.span>
            <motion.h2
              id="courses-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: settings.reduceMotion ? 0 : 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold"
            >
              Popular{' '}
              <span className="text-gradient-warm">Accessible Courses</span>
            </motion.h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/courses" className="group">
              View All Courses
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.article
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: settings.reduceMotion ? 0 : 0.5, 
                delay: settings.reduceMotion ? 0 : index * 0.1 
              }}
              className="card-interactive overflow-hidden group"
            >
              <Link to={`/courses/${course.id}`} className="block">
                {/* Thumbnail */}
                <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">📚</span>
                  </div>
                  <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${levelColors[course.level as keyof typeof levelColors]}`}>
                    {course.level}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{course.category}</span>
                    <span aria-hidden="true">•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {course.duration}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>

                  {/* Accessibility Features */}
                  <div className="flex flex-wrap gap-1.5" aria-label="Accessibility features">
                    {course.accessibilityFeatures.map((feature) => (
                      <span
                        key={feature}
                        className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                      >
                        <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-sm text-muted-foreground">
                      By {course.instructor}
                    </span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-3.5 h-3.5" aria-hidden="true" />
                        {course.students.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-secondary">
                        <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                        {course.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
