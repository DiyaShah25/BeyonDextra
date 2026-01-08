import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, Users, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroScene } from '@/components/3d/HeroScene';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const stats = [
  { icon: Users, value: '50,000+', label: 'Learners Empowered' },
  { icon: BookOpen, value: '500+', label: 'Accessible Courses' },
  { icon: Award, value: '98%', label: 'Completion Rate' },
];

const features = [
  'Screen reader optimized',
  'Sign language support',
  'Adjustable playback speed',
  'Multi-format content',
];

export function HeroSection() {
  const { settings, speak } = useAccessibility();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: settings.reduceMotion ? 0 : 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: settings.reduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: settings.reduceMotion ? 0 : 0.6 }
    },
  };

  return (
    <section 
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* 3D Background */}
      <HeroScene />
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="badge-secondary inline-flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden="true" />
              Inclusive Education for Everyone
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            id="hero-heading"
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight mb-6"
          >
            Learn Without{' '}
            <span className="text-gradient">Limits</span>
            <br />
            Grow Beyond{' '}
            <span className="text-gradient-warm">Expectations</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8"
            onMouseEnter={() => settings.textToSpeech && speak("BeyonDextra is the world's most accessible learning platform, designed for every ability and learning style.")}
          >
            BeyonDextra is the world's most accessible learning platform, designed for 
            every ability and learning style. Experience education that adapts to you.
          </motion.p>

          {/* Features List */}
          <motion.ul
            variants={itemVariants}
            className="flex flex-wrap gap-3 mb-8"
            role="list"
            aria-label="Key accessibility features"
          >
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full"
              >
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </motion.ul>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Button asChild size="lg" className="btn-hero">
              <Link to="/courses">
                Start Learning Free
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="group">
              <Link to="/about" className="flex items-center gap-2">
                <span className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Play className="w-4 h-4 text-primary" aria-hidden="true" />
                </span>
                Watch How It Works
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            role="list"
            aria-label="Platform statistics"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 p-4 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50"
                role="listitem"
              >
                <div className="p-3 rounded-xl bg-primary/10">
                  <stat.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
