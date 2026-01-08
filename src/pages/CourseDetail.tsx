import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
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
  Lock
} from 'lucide-react';

// Mock course data
const courseData = {
  id: 'web-dev-101',
  title: 'Web Development Fundamentals',
  description: 'Master HTML, CSS, and JavaScript with full accessibility support and hands-on projects. This comprehensive course is designed to take you from complete beginner to confident web developer.',
  instructor: 'Sarah Chen',
  instructorBio: 'Senior Web Developer with 10+ years of experience teaching accessible web development.',
  duration: '12 hours',
  students: 3420,
  rating: 4.9,
  reviews: 428,
  level: 'beginner',
  category: 'Technology',
  lastUpdated: 'December 2024',
  language: 'English',
  accessibilityFeatures: [
    'Closed Captions (CC)',
    'Sign Language Interpretation',
    'Audio Descriptions',
    'Full Transcripts',
    'Keyboard Navigation',
    'Screen Reader Optimized',
  ],
  whatYouLearn: [
    'Build responsive websites from scratch',
    'Master HTML5 semantic elements for accessibility',
    'Create stunning layouts with CSS Flexbox and Grid',
    'Add interactivity with JavaScript',
    'Implement accessibility best practices',
    'Deploy your projects to the web',
  ],
  modules: [
    {
      id: 'mod-1',
      title: 'Introduction to Web Development',
      duration: '1.5 hours',
      lessons: [
        { id: 'les-1', title: 'Welcome & Course Overview', type: 'video', duration: '10 min', free: true },
        { id: 'les-2', title: 'How the Web Works', type: 'video', duration: '15 min', free: true },
        { id: 'les-3', title: 'Setting Up Your Development Environment', type: 'video', duration: '20 min', free: false },
        { id: 'les-4', title: 'Module Quiz', type: 'quiz', duration: '10 min', free: false },
      ],
    },
    {
      id: 'mod-2',
      title: 'HTML Fundamentals',
      duration: '3 hours',
      lessons: [
        { id: 'les-5', title: 'HTML Document Structure', type: 'video', duration: '25 min', free: false },
        { id: 'les-6', title: 'Text & Typography Elements', type: 'video', duration: '30 min', free: false },
        { id: 'les-7', title: 'Links & Navigation', type: 'video', duration: '25 min', free: false },
        { id: 'les-8', title: 'Images & Media', type: 'video', duration: '30 min', free: false },
        { id: 'les-9', title: 'Forms & Input Elements', type: 'video', duration: '35 min', free: false },
        { id: 'les-10', title: 'Semantic HTML for Accessibility', type: 'video', duration: '30 min', free: false },
        { id: 'les-11', title: 'HTML Practice Project', type: 'project', duration: '45 min', free: false },
      ],
    },
    {
      id: 'mod-3',
      title: 'CSS Styling',
      duration: '4 hours',
      lessons: [
        { id: 'les-12', title: 'CSS Basics & Selectors', type: 'video', duration: '30 min', free: false },
        { id: 'les-13', title: 'Colors & Typography', type: 'video', duration: '25 min', free: false },
        { id: 'les-14', title: 'Box Model & Layout', type: 'video', duration: '35 min', free: false },
        { id: 'les-15', title: 'Flexbox Deep Dive', type: 'video', duration: '45 min', free: false },
        { id: 'les-16', title: 'CSS Grid Mastery', type: 'video', duration: '45 min', free: false },
        { id: 'les-17', title: 'Responsive Design', type: 'video', duration: '40 min', free: false },
      ],
    },
  ],
};

const lessonTypeIcons = {
  video: Video,
  quiz: HelpCircle,
  project: FileText,
};

export default function CourseDetailPage() {
  const { courseId } = useParams();

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
                <span className="badge-primary">{courseData.category}</span>
                <span className="badge-success">{courseData.level}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
                {courseData.title}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                {courseData.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-secondary fill-secondary" />
                  <strong>{courseData.rating}</strong>
                  <span className="text-muted-foreground">({courseData.reviews} reviews)</span>
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {courseData.students.toLocaleString()} students
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {courseData.duration}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  👩‍💻
                </div>
                <div>
                  <p className="font-medium">{courseData.instructor}</p>
                  <p className="text-sm text-muted-foreground">{courseData.instructorBio}</p>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="card-elevated sticky top-24">
                <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <button className="relative z-10 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform">
                    <Play className="w-8 h-8" />
                  </button>
                </div>
                
                <p className="text-3xl font-bold mb-2">Free</p>
                <p className="text-muted-foreground text-sm mb-6">Full access to all course content</p>

                <Button className="w-full mb-4" size="lg">
                  Enroll Now - It's Free
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Add to Wishlist
                </Button>

                <div className="mt-6 pt-6 border-t border-border space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{courseData.duration} of content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span>{courseData.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons</span>
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
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* What You'll Learn */}
              <div>
                <h2 className="text-2xl font-display font-bold mb-6">What You'll Learn</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {courseData.whatYouLearn.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accessibility Features */}
              <div>
                <h2 className="text-2xl font-display font-bold mb-6">Accessibility Features</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {courseData.accessibilityFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 p-3 rounded-lg bg-primary/5">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Content */}
              <div>
                <h2 className="text-2xl font-display font-bold mb-6">Course Content</h2>
                <p className="text-muted-foreground mb-6">
                  {courseData.modules.length} modules • {courseData.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons • {courseData.duration} total
                </p>

                <div className="space-y-4">
                  {courseData.modules.map((module, idx) => (
                    <details key={module.id} className="group card-elevated" open={idx === 0}>
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                            {idx + 1}
                          </span>
                          <div>
                            <h3 className="font-semibold">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {module.lessons.length} lessons • {module.duration}
                            </p>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                      </summary>
                      
                      <div className="mt-4 pt-4 border-t border-border space-y-2">
                        {module.lessons.map((lesson) => {
                          const Icon = lessonTypeIcons[lesson.type as keyof typeof lessonTypeIcons] || Video;
                          return (
                            <div 
                              key={lesson.id} 
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <Icon className="w-4 h-4 text-muted-foreground" />
                              <span className="flex-1">{lesson.title}</span>
                              {lesson.free && (
                                <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
                                  Free
                                </span>
                              )}
                              {!lesson.free && <Lock className="w-4 h-4 text-muted-foreground" />}
                              <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                            </div>
                          );
                        })}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
