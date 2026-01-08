import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  MessageSquare, 
  Users, 
  Eye, 
  Pin,
  CheckCircle2,
  Plus,
  TrendingUp,
  Clock
} from 'lucide-react';

const categories = ['All', 'General', 'Technical Help', 'Study Groups', 'Accessibility', 'Career Advice'];

const threads = [
  {
    id: 1,
    title: 'Tips for using screen readers with code editors?',
    author: 'Marcus T.',
    avatar: '👨‍🦯',
    category: 'Accessibility',
    replies: 24,
    views: 156,
    isPinned: true,
    isSolved: true,
    createdAt: '2 hours ago',
  },
  {
    id: 2,
    title: 'Looking for study group - Web Development Fundamentals',
    author: 'Emily R.',
    avatar: '👩‍💻',
    category: 'Study Groups',
    replies: 12,
    views: 89,
    isPinned: false,
    isSolved: false,
    createdAt: '5 hours ago',
  },
  {
    id: 3,
    title: 'How to implement accessible forms in React?',
    author: 'David K.',
    avatar: '👨‍💼',
    category: 'Technical Help',
    replies: 31,
    views: 245,
    isPinned: true,
    isSolved: true,
    createdAt: '1 day ago',
  },
  {
    id: 4,
    title: 'Career transition to UX with a disability - my journey',
    author: 'Aisha P.',
    avatar: '👩‍🎨',
    category: 'Career Advice',
    replies: 67,
    views: 534,
    isPinned: false,
    isSolved: false,
    createdAt: '2 days ago',
  },
  {
    id: 5,
    title: 'Best keyboard shortcuts for faster learning',
    author: 'James C.',
    avatar: '⌨️',
    category: 'Accessibility',
    replies: 18,
    views: 123,
    isPinned: false,
    isSolved: true,
    createdAt: '3 days ago',
  },
];

const topContributors = [
  { name: 'Sarah C.', avatar: '👩‍💻', points: 2450, badge: '🏆' },
  { name: 'Marcus T.', avatar: '👨‍🦯', points: 2180, badge: '🥈' },
  { name: 'Emily R.', avatar: '👩‍🎓', points: 1890, badge: '🥉' },
];

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || thread.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
              Community <span className="text-gradient">Forum</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with fellow learners, share experiences, and get help from our supportive community.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="space-y-6">
              <Button className="w-full" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                New Discussion
              </Button>

              {/* Categories */}
              <div className="card-elevated">
                <h3 className="font-semibold mb-4">Categories</h3>
                <nav aria-label="Forum categories">
                  <ul className="space-y-1">
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedCategory === category 
                              ? 'bg-primary text-primary-foreground' 
                              : 'hover:bg-muted'
                          }`}
                          aria-current={selectedCategory === category ? 'page' : undefined}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Top Contributors */}
              <div className="card-elevated">
                <h3 className="font-semibold mb-4">Top Contributors</h3>
                <ul className="space-y-3">
                  {topContributors.map((contributor, index) => (
                    <li key={contributor.name} className="flex items-center gap-3">
                      <span className="text-xl">{contributor.badge}</span>
                      <span className="text-2xl">{contributor.avatar}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{contributor.name}</p>
                        <p className="text-xs text-muted-foreground">{contributor.points} points</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Community Stats */}
              <div className="card-elevated">
                <h3 className="font-semibold mb-4">Community Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Members</span>
                    <span className="font-medium">12,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Today</span>
                    <span className="font-medium">847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Discussions</span>
                    <span className="font-medium">3,289</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Threads */}
            <div className="lg:col-span-3">
              {/* Search */}
              <div className="flex gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    aria-label="Search discussions"
                  />
                </div>
                <Button variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending
                </Button>
              </div>

              {/* Thread List */}
              <div className="space-y-4" role="list" aria-label="Forum threads">
                {filteredThreads.map((thread, index) => (
                  <motion.article
                    key={thread.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card-interactive"
                    role="listitem"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                        {thread.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {thread.isPinned && (
                            <Pin className="w-4 h-4 text-primary" aria-label="Pinned" />
                          )}
                          {thread.isSolved && (
                            <span className="inline-flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              Solved
                            </span>
                          )}
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                            {thread.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer">
                          {thread.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>By {thread.author}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {thread.createdAt}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {thread.replies} replies
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {thread.views} views
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {filteredThreads.length === 0 && (
                <div className="text-center py-16">
                  <MessageSquare className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No discussions found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or start a new discussion.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
