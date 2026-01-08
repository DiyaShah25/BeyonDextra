import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const testimonials = [
  {
    id: 1,
    name: 'Emily Rodriguez',
    role: 'Software Developer',
    avatar: '👩‍💻',
    content: 'As someone with dyslexia, I\'ve always struggled with online courses. BeyonDextra\'s dyslexia-friendly fonts and text-to-speech changed everything. I finally completed my first programming certification!',
    rating: 5,
    disability: 'Dyslexia',
  },
  {
    id: 2,
    name: 'Marcus Thompson',
    role: 'Data Analyst',
    avatar: '👨‍🦯',
    content: 'The screen reader optimization is incredible. Every element is properly labeled, and the keyboard navigation is flawless. This is how all education platforms should be built.',
    rating: 5,
    disability: 'Visual Impairment',
  },
  {
    id: 3,
    name: 'Aisha Patel',
    role: 'UX Designer',
    avatar: '👩‍🎨',
    content: 'The sign language videos and accurate captions made learning web design accessible for me. I never felt left behind in any lesson.',
    rating: 5,
    disability: 'Deaf',
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Project Manager',
    avatar: '👨‍💼',
    content: 'Voice navigation and the distraction-free mode help me focus despite my ADHD. The cognitive-friendly design makes complex topics manageable.',
    rating: 5,
    disability: 'ADHD',
  },
];

export function TestimonialsSection() {
  const { settings } = useAccessibility();

  return (
    <section 
      className="section-padding bg-muted/30"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: settings.reduceMotion ? 0 : 0.5 }}
            className="badge-primary mb-4"
          >
            Success Stories
          </motion.span>
          <motion.h2
            id="testimonials-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: settings.reduceMotion ? 0 : 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6"
          >
            Empowering{' '}
            <span className="text-gradient">Real Learners</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: settings.reduceMotion ? 0 : 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Hear from learners who've transformed their education journey with our accessible platform.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: settings.reduceMotion ? 0 : 0.5, 
                delay: settings.reduceMotion ? 0 : index * 0.1 
              }}
              className="card-elevated relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-12 h-12 text-primary" aria-hidden="true" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4" aria-label={`Rating: ${testimonial.rating} out of 5 stars`}>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-secondary fill-secondary" aria-hidden="true" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-foreground mb-6 relative z-10">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <footer className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <cite className="font-semibold not-italic">{testimonial.name}</cite>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{testimonial.role}</span>
                    <span aria-hidden="true">•</span>
                    <span className="text-primary">{testimonial.disability}</span>
                  </div>
                </div>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
