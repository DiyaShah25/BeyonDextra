import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
  Globe,
  Video,
  FileText,
  BookOpen,
  MessageSquare,
  Award,
  Shield,
  Clock,
  Users,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const accessibilityFeatures = [
  {
    category: 'Visual Accessibility',
    icon: Eye,
    color: 'primary',
    features: [
      'High contrast mode with adjustable settings',
      'Screen reader optimization (NVDA, JAWS, VoiceOver)',
      'Adjustable text sizes up to 200%',
      'Focus indicators for keyboard navigation',
      'Color blind friendly palettes',
    ],
  },
  {
    category: 'Hearing Support',
    icon: Ear,
    color: 'secondary',
    features: [
      'Accurate closed captions on all videos',
      'Sign language interpretation videos',
      'Visual alerts for audio cues',
      'Transcripts for all audio content',
      'Adjustable caption styling',
    ],
  },
  {
    category: 'Cognitive Support',
    icon: Brain,
    color: 'accent',
    features: [
      'Distraction-free reading mode',
      'Simplified navigation options',
      'Progress indicators and time estimates',
      'Chunk-based learning modules',
      'Memory aids and summaries',
    ],
  },
  {
    category: 'Motor Accessibility',
    icon: Hand,
    color: 'success',
    features: [
      'Full keyboard navigation',
      'Voice command support',
      'Adjustable timing for interactions',
      'Large click targets',
      'Switch device compatibility',
    ],
  },
];

const platformFeatures = [
  {
    icon: Video,
    title: 'Adaptive Video Player',
    description: 'Customizable playback with captions, sign language overlay, and audio descriptions.',
  },
  {
    icon: FileText,
    title: 'Multi-Format Content',
    description: 'Every lesson available as video, audio, text, and interactive formats.',
  },
  {
    icon: BookOpen,
    title: 'Personalized Learning Paths',
    description: 'AI-powered recommendations based on your preferences and pace.',
  },
  {
    icon: MessageSquare,
    title: 'Accessible Community',
    description: 'Forums with screen reader support, voice posting, and moderated discussions.',
  },
  {
    icon: Award,
    title: 'Gamification',
    description: 'Earn XP, badges, and certificates with accessible achievement tracking.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your accessibility preferences and data are always secure and private.',
  },
];

export default function FeaturesPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge-secondary mb-6">Features</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
                Built for{' '}
                <span className="text-gradient-warm">Accessibility</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Every feature is designed with inclusivity at its core. Explore our 
                comprehensive accessibility tools and platform capabilities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="section-padding" aria-labelledby="accessibility-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 id="accessibility-heading" className="text-3xl sm:text-4xl font-display font-bold mb-6">
              Comprehensive Accessibility
            </h2>
            <p className="text-lg text-muted-foreground">
              WCAG 2.2 AAA compliant with features for every type of learner.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {accessibilityFeatures.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-elevated"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl bg-${category.color}/10`}>
                    <category.icon className={`w-8 h-8 text-${category.color}`} />
                  </div>
                  <h3 className="font-semibold text-xl">{category.category}</h3>
                </div>
                <ul className="space-y-3">
                  {category.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="section-padding bg-muted/30" aria-labelledby="platform-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 id="platform-heading" className="text-3xl sm:text-4xl font-display font-bold mb-6">
              Platform Capabilities
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful learning tools designed for everyone.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-elevated"
              >
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
              Experience Accessible Learning
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Try all features free for 14 days. No credit card required.
            </p>
            <Button size="lg" asChild className="btn-hero">
              <Link to="/register">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
