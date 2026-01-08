import React from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Ear, 
  Brain, 
  Hand,
  Mic,
  Volume2,
  Type,
  Palette,
  Zap,
  Globe
} from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const features = [
  {
    icon: Eye,
    title: 'Visual Accessibility',
    description: 'High contrast modes, screen reader support, and adjustable text sizes for low-vision learners.',
    color: 'primary',
  },
  {
    icon: Ear,
    title: 'Hearing Support',
    description: 'Sign language videos, accurate captions, and visual alerts for deaf and hard-of-hearing users.',
    color: 'secondary',
  },
  {
    icon: Brain,
    title: 'Cognitive Friendly',
    description: 'Distraction-free mode, simplified layouts, and clear navigation for cognitive disabilities.',
    color: 'accent',
  },
  {
    icon: Hand,
    title: 'Motor Accessibility',
    description: 'Full keyboard navigation, voice commands, and adjustable timing for motor impairments.',
    color: 'success',
  },
  {
    icon: Mic,
    title: 'Speech-to-Text',
    description: 'Navigate and interact using voice commands. Answer quizzes and participate hands-free.',
    color: 'info',
  },
  {
    icon: Volume2,
    title: 'Text-to-Speech',
    description: 'Listen to any content read aloud with adjustable speed and natural voices.',
    color: 'warning',
  },
  {
    icon: Type,
    title: 'Dyslexia Support',
    description: 'OpenDyslexic font, increased spacing, and reading guides for easier text processing.',
    color: 'primary',
  },
  {
    icon: Palette,
    title: 'Color Blind Modes',
    description: 'Optimized color palettes for protanopia, deuteranopia, and tritanopia.',
    color: 'secondary',
  },
  {
    icon: Zap,
    title: 'Reduced Motion',
    description: 'Minimize animations for vestibular disorders and motion sensitivity.',
    color: 'accent',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    description: 'Content available in multiple languages with localized accessibility features.',
    color: 'success',
  },
];

const colorClasses = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/20 text-secondary-foreground',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  info: 'bg-info/10 text-info',
  warning: 'bg-warning/10 text-warning-foreground',
};

export function FeaturesSection() {
  const { settings } = useAccessibility();

  return (
    <section 
      className="section-padding bg-muted/30"
      aria-labelledby="features-heading"
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
            Accessibility First
          </motion.span>
          <motion.h2
            id="features-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: settings.reduceMotion ? 0 : 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6"
          >
            Designed for{' '}
            <span className="text-gradient">Every Learner</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: settings.reduceMotion ? 0 : 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Our platform is built from the ground up with accessibility at its core, 
            ensuring everyone can learn effectively regardless of their abilities.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: settings.reduceMotion ? 0 : 0.5, 
                delay: settings.reduceMotion ? 0 : index * 0.05 
              }}
              className="card-elevated group"
            >
              <div className={`p-3 rounded-xl ${colorClasses[feature.color as keyof typeof colorClasses]} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
