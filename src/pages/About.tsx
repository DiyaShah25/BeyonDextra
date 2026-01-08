import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { 
  Target, 
  Heart, 
  Users, 
  Globe, 
  Award,
  Lightbulb,
  Shield,
  Zap
} from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Empathy First',
    description: 'We design every feature with deep understanding of diverse learning needs.',
  },
  {
    icon: Users,
    title: 'Inclusive Community',
    description: 'Everyone belongs here, regardless of ability, background, or learning style.',
  },
  {
    icon: Globe,
    title: 'Universal Access',
    description: 'Education should have no barriers—geographic, physical, or cognitive.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We maintain the highest standards in both content quality and accessibility.',
  },
];

const team = [
  { name: 'Dr. Maya Patel', role: 'CEO & Founder', avatar: '👩‍⚕️', bio: 'Former accessibility researcher at MIT' },
  { name: 'James Chen', role: 'CTO', avatar: '👨‍💻', bio: 'Built accessible systems at Google' },
  { name: 'Sarah Williams', role: 'Head of Accessibility', avatar: '👩‍🦯', bio: 'Blind accessibility advocate & engineer' },
  { name: 'Marcus Johnson', role: 'Head of Content', avatar: '👨‍🏫', bio: 'Special education expert, 15+ years' },
];

const milestones = [
  { year: '2020', event: 'BeyonDextra founded with a mission to democratize accessible education' },
  { year: '2021', event: 'Launched first 50 fully accessible courses with sign language support' },
  { year: '2022', event: 'Reached 10,000 learners with disabilities across 40 countries' },
  { year: '2023', event: 'Achieved WCAG 2.2 AAA compliance across entire platform' },
  { year: '2024', event: 'Expanded to 500+ courses and 50,000+ empowered learners' },
];

export default function AboutPage() {
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
              <span className="badge-primary mb-6">About Us</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
                Education That{' '}
                <span className="text-gradient">Includes Everyone</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                BeyonDextra was born from a simple belief: everyone deserves access to 
                world-class education, regardless of their abilities or learning differences.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding" aria-labelledby="mission-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-primary/10 mb-6">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 id="mission-heading" className="text-3xl sm:text-4xl font-display font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                To transform online education by creating the most accessible, inclusive, 
                and empowering learning platform in the world. We believe that disability 
                is not inability—it's simply a different way of learning.
              </p>
              <p className="text-lg text-muted-foreground">
                Every design decision, every feature, and every piece of content is created 
                with accessibility as the foundation, not an afterthought.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="card-elevated text-center p-6">
                <p className="text-4xl font-bold text-primary mb-2">50K+</p>
                <p className="text-sm text-muted-foreground">Learners Empowered</p>
              </div>
              <div className="card-elevated text-center p-6">
                <p className="text-4xl font-bold text-secondary mb-2">500+</p>
                <p className="text-sm text-muted-foreground">Accessible Courses</p>
              </div>
              <div className="card-elevated text-center p-6">
                <p className="text-4xl font-bold text-accent mb-2">40+</p>
                <p className="text-sm text-muted-foreground">Countries Reached</p>
              </div>
              <div className="card-elevated text-center p-6">
                <p className="text-4xl font-bold text-success mb-2">98%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-muted/30" aria-labelledby="values-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 id="values-heading" className="text-3xl sm:text-4xl font-display font-bold mb-6">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground">
              These principles guide everything we do at BeyonDextra.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-elevated text-center"
              >
                <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding" aria-labelledby="team-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 id="team-heading" className="text-3xl sm:text-4xl font-display font-bold mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground">
              A diverse team of educators, engineers, and accessibility advocates.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-elevated text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-muted/30" aria-labelledby="journey-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 id="journey-heading" className="text-3xl sm:text-4xl font-display font-bold mb-6">
              Our Journey
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6 mb-8"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {milestone.year}
                </div>
                <div className="card-elevated flex-1">
                  <p className="text-foreground">{milestone.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
