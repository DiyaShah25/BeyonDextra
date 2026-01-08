import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Star, 
  CheckCircle2,
  Grid,
  List,
  BookOpen
} from 'lucide-react';

const categories = ['All', 'Technology', 'Business', 'Data', 'Design', 'Personal Development'];
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

const courses = [
  {
    id: 'web-dev-101',
    title: 'Web Development Fundamentals',
    description: 'Master HTML, CSS, and JavaScript with full accessibility support and hands-on projects.',
    instructor: 'Sarah Chen',
    duration: '12 hours',
    students: 3420,
    rating: 4.9,
    level: 'beginner',
    category: 'Technology',
    accessibilityFeatures: ['Captions', 'Sign Language', 'Audio Description'],
    price: 'Free',
  },
  {
    id: 'data-science-101',
    title: 'Data Science for Everyone',
    description: 'Learn data analysis with Python in an inclusive, beginner-friendly environment.',
    instructor: 'Dr. James Miller',
    duration: '20 hours',
    students: 2180,
    rating: 4.8,
    level: 'intermediate',
    category: 'Data',
    accessibilityFeatures: ['Captions', 'Transcripts', 'Simplified Mode'],
    price: '$49',
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Mastery',
    description: 'Build marketing skills with adaptive learning paths and real-world case studies.',
    instructor: 'Maria Garcia',
    duration: '15 hours',
    students: 4560,
    rating: 4.9,
    level: 'beginner',
    category: 'Business',
    accessibilityFeatures: ['Captions', 'Text Alternatives', 'Voice Navigation'],
    price: '$39',
  },
  {
    id: 'ux-design',
    title: 'Accessible UX Design',
    description: 'Learn to create inclusive user experiences that work for everyone.',
    instructor: 'Alex Rivera',
    duration: '18 hours',
    students: 1890,
    rating: 4.7,
    level: 'intermediate',
    category: 'Design',
    accessibilityFeatures: ['Captions', 'Sign Language', 'Dyslexia Font'],
    price: '$59',
  },
  {
    id: 'python-basics',
    title: 'Python Programming Basics',
    description: 'Start your coding journey with Python, the most beginner-friendly language.',
    instructor: 'David Kim',
    duration: '16 hours',
    students: 5230,
    rating: 4.9,
    level: 'beginner',
    category: 'Technology',
    accessibilityFeatures: ['Captions', 'Transcripts', 'Audio Description'],
    price: 'Free',
  },
  {
    id: 'leadership',
    title: 'Leadership & Communication',
    description: 'Develop essential leadership skills with inclusive communication techniques.',
    instructor: 'Emma Watson',
    duration: '10 hours',
    students: 2340,
    rating: 4.8,
    level: 'beginner',
    category: 'Personal Development',
    accessibilityFeatures: ['Captions', 'Sign Language', 'Simplified Mode'],
    price: '$29',
  },
];

const levelColors = {
  beginner: 'bg-success/10 text-success',
  intermediate: 'bg-warning/10 text-warning-foreground',
  advanced: 'bg-accent/10 text-accent',
};

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All Levels' || 
      course.level.toLowerCase() === selectedLevel.toLowerCase();
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
              Explore <span className="text-gradient">Accessible Courses</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              All courses include comprehensive accessibility features. Learn at your own pace.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Search courses"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-sm"
                  aria-label="Filter by category"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-background border border-input rounded-lg px-3 py-2 text-sm"
                aria-label="Filter by level"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-background shadow-sm' : ''}`}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-background shadow-sm' : ''}`}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="section-padding" aria-labelledby="courses-results">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="courses-results" className="sr-only">Course Results</h2>
          <p className="text-muted-foreground mb-8">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>

          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
            : 'flex flex-col gap-6'
          }>
            {filteredCourses.map((course, index) => (
              <motion.article
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={viewMode === 'grid' 
                  ? 'card-interactive overflow-hidden' 
                  : 'card-interactive flex gap-6 items-start'
                }
              >
                <Link to={`/courses/${course.id}`} className={viewMode === 'grid' ? 'block' : 'flex gap-6 flex-1'}>
                  {/* Thumbnail */}
                  <div className={`relative bg-muted rounded-lg overflow-hidden ${viewMode === 'grid' ? 'aspect-video mb-4' : 'w-48 h-32 flex-shrink-0'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-primary/50" />
                    </div>
                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium ${levelColors[course.level as keyof typeof levelColors]}`}>
                      {course.level}
                    </span>
                    {course.price === 'Free' && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium bg-success text-success-foreground">
                        Free
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>{course.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.duration}
                      </span>
                    </div>

                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Accessibility Features */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {course.accessibilityFeatures.map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-sm text-muted-foreground">By {course.instructor}</span>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-3.5 h-3.5" />
                          {course.students.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-secondary">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {course.rating}
                        </span>
                        <span className="font-semibold text-primary">{course.price}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No courses found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
