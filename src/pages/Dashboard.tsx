import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Target,
  TrendingUp,
  Award,
  Star,
  Play,
  CheckCircle2,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const enrolledCourses = [
  { id: 1, title: 'Web Development Fundamentals', progress: 75, nextLesson: 'CSS Grid Mastery', instructor: 'Sarah Chen' },
  { id: 2, title: 'Data Science for Everyone', progress: 30, nextLesson: 'Introduction to Pandas', instructor: 'Dr. James Miller' },
  { id: 3, title: 'Digital Marketing Mastery', progress: 10, nextLesson: 'SEO Fundamentals', instructor: 'Maria Garcia' },
];

const achievements = [
  { icon: '🎯', title: 'First Steps', description: 'Complete your first lesson', earned: true },
  { icon: '⚡', title: 'Quick Learner', description: 'Complete 5 lessons in one day', earned: true },
  { icon: '⭐', title: 'Community Star', description: 'Help 10 other learners', earned: true },
  { icon: '🔥', title: 'On Fire', description: '7-day learning streak', earned: false },
  { icon: '🏆', title: 'Course Master', description: 'Complete 5 courses', earned: false },
];

const upcomingEvents = [
  { title: 'Live Q&A: Web Accessibility', date: 'Tomorrow, 3:00 PM', instructor: 'Sarah Chen' },
  { title: 'Workshop: Debugging JavaScript', date: 'Friday, 2:00 PM', instructor: 'Alex Rivera' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  const xpToNextLevel = 3000;
  const currentXp = user?.xp || 2450;
  const progressPercent = (currentXp / xpToNextLevel) * 100;

  return (
    <Layout>
      <div className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
              Welcome back, <span className="text-gradient">{user?.name || 'Learner'}</span>!
            </h1>
            <p className="text-muted-foreground">Continue your learning journey where you left off.</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                <div className="card-elevated text-center">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Active Courses</p>
                </div>
                <div className="card-elevated text-center">
                  <Clock className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold">12h</p>
                  <p className="text-sm text-muted-foreground">Learning Time</p>
                </div>
                <div className="card-elevated text-center">
                  <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold">{user?.badges.length || 3}</p>
                  <p className="text-sm text-muted-foreground">Badges Earned</p>
                </div>
                <div className="card-elevated text-center">
                  <Target className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold">7</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </motion.div>

              {/* Continue Learning */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                aria-labelledby="continue-learning"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 id="continue-learning" className="text-xl font-semibold">Continue Learning</h2>
                  <Link to="/courses" className="text-primary hover:underline text-sm">
                    View all
                  </Link>
                </div>

                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <article key={course.id} className="card-elevated group">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            By {course.instructor} • Next: {course.nextLesson}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{ width: `${course.progress}%` }}
                                  role="progressbar"
                                  aria-valuenow={course.progress}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                            </div>
                            <span className="text-sm font-medium">{course.progress}%</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/courses/${course.id}/learn`}>
                            <Play className="w-4 h-4 mr-1" />
                            Continue
                          </Link>
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </motion.section>

              {/* Recent Activity */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                aria-labelledby="achievements"
              >
                <h2 id="achievements" className="text-xl font-semibold mb-6">Achievements</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.title}
                      className={`card-elevated text-center ${!achievement.earned ? 'opacity-50' : ''}`}
                    >
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <p className="font-medium text-sm">{achievement.title}</p>
                      {achievement.earned && (
                        <CheckCircle2 className="w-4 h-4 text-success mx-auto mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* XP Progress */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card-elevated"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Level Progress</h3>
                  <span className="badge-primary">Level {user?.level || 12}</span>
                </div>
                <div className="progress-bar mb-2">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentXp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
                </p>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="card-elevated"
              >
                <h3 className="font-semibold mb-4">Upcoming Events</h3>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.title} className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                        <p className="text-xs text-muted-foreground">By {event.instructor}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Events
                </Button>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="card-elevated"
              >
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link 
                    to="/courses" 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span>Browse Courses</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link 
                    to="/community" 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span>Visit Community</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link 
                    to="/settings" 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span>Accessibility Settings</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
