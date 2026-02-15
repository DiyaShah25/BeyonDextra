import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Youtube, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const topicSuggestions = [
  { label: '🌐 Web Development', query: 'Web Development Tutorial' },
  { label: '🐍 Python', query: 'Python Programming' },
  { label: '📊 Data Science', query: 'Data Science Beginner' },
  { label: '🤖 Machine Learning', query: 'Machine Learning' },
  { label: '⚛️ React JS', query: 'React JS Course' },
  { label: '📱 Mobile Dev', query: 'Mobile App Development' },
  { label: '🎨 UX Design', query: 'UX Design' },
  { label: '📈 Digital Marketing', query: 'Digital Marketing' },
];

export function CoursesSection() {
  const { settings } = useAccessibility();
  const navigate = useNavigate();

  const goToCoursesWithQuery = (query: string) => {
    navigate(`/courses?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="section-padding" aria-labelledby="courses-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: settings.reduceMotion ? 0 : 0.5 }}
            className="badge-secondary mb-4"
          >
            <Youtube className="w-4 h-4 inline-block mr-1" aria-hidden="true" />
            YouTube-Powered Learning
          </motion.span>
          <motion.h2
            id="courses-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: settings.reduceMotion ? 0 : 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold"
          >
            Explore{' '}
            <span className="text-gradient-warm">Any Topic</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: settings.reduceMotion ? 0 : 0.5, delay: 0.2 }}
            className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg"
          >
            Search YouTube playlists, watch videos in-app, and test your knowledge with AI-generated quizzes.
          </motion.p>
        </div>

        {/* Topic Suggestions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: settings.reduceMotion ? 0 : 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {topicSuggestions.map((topic, index) => (
            <motion.button
              key={topic.query}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: settings.reduceMotion ? 0 : 0.3, delay: settings.reduceMotion ? 0 : 0.3 + index * 0.05 }}
              whileHover={{ scale: settings.reduceMotion ? 1 : 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => goToCoursesWithQuery(topic.query)}
              className="px-5 py-2.5 rounded-full border border-border bg-card hover:bg-primary/10 hover:border-primary/40 transition-colors text-sm font-medium cursor-pointer flex items-center gap-2 group"
            >
              {topic.label}
              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden="true" />
            </motion.button>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: settings.reduceMotion ? 0 : 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" onClick={() => navigate('/courses')} className="group">
            <Search className="w-4 h-4 mr-2" aria-hidden="true" />
            Browse All Courses
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Button>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
            AI quizzes included with every video
          </span>
        </motion.div>
      </div>
    </section>
  );
}
