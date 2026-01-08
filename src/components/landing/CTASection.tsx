import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export function CTASection() {
  const { settings } = useAccessibility();

  return (
    <section 
      className="section-padding relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary-dark" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: settings.reduceMotion ? 0 : 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 mb-6">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm font-medium">Start your journey today</span>
          </div>

          <h2
            id="cta-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6"
          >
            Ready to Learn Without Barriers?
          </h2>

          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who've discovered their potential with our 
            accessible education platform. Your first course is completely free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              asChild 
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              <Link to="/register">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Link to="/courses">
                Browse Courses
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-white/60">
            No credit card required • Full accessibility features • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
