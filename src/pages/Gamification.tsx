import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Star, Zap, Target, Award, TrendingUp,
  Crown, Medal, Gift, Flame, Lock, CheckCircle2
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const userStats = {
  level: 12,
  xp: 2450,
  xpToNextLevel: 3000,
  streak: 7,
  totalBadges: 15,
  rank: 234,
};

const badges = [
  { id: 1, name: 'First Steps', description: 'Complete your first lesson', icon: Star, earned: true, date: 'Jan 5, 2024' },
  { id: 2, name: 'Quick Learner', description: 'Complete 5 lessons in one day', icon: Zap, earned: true, date: 'Jan 8, 2024' },
  { id: 3, name: 'Streak Master', description: 'Maintain a 7-day streak', icon: Flame, earned: true, date: 'Jan 12, 2024' },
  { id: 4, name: 'Course Champion', description: 'Complete your first course', icon: Trophy, earned: true, date: 'Jan 15, 2024' },
  { id: 5, name: 'Helper', description: 'Answer 10 community questions', icon: Award, earned: true, date: 'Jan 20, 2024' },
  { id: 6, name: 'Perfectionist', description: 'Score 100% on 5 quizzes', icon: Target, earned: false, progress: 60 },
  { id: 7, name: 'Social Butterfly', description: 'Connect with 20 learners', icon: Star, earned: false, progress: 45 },
  { id: 8, name: 'Top Contributor', description: 'Get 50 upvotes on your posts', icon: Crown, earned: false, progress: 30 },
];

const leaderboard = [
  { rank: 1, name: 'Alex Thompson', xp: 15420, level: 25, avatar: 'AT' },
  { rank: 2, name: 'Maria Garcia', xp: 14890, level: 24, avatar: 'MG' },
  { rank: 3, name: 'John Smith', xp: 13200, level: 22, avatar: 'JS' },
  { rank: 4, name: 'Sarah Lee', xp: 12100, level: 21, avatar: 'SL' },
  { rank: 5, name: 'You', xp: userStats.xp, level: userStats.level, avatar: 'YO', isCurrentUser: true },
];

const dailyChallenges = [
  { id: 1, title: 'Complete 2 lessons', xp: 50, completed: true },
  { id: 2, title: 'Score 80%+ on a quiz', xp: 75, completed: true },
  { id: 3, title: 'Post in the community', xp: 30, completed: false },
  { id: 4, title: 'Help another learner', xp: 100, completed: false },
];

const rewards = [
  { id: 1, name: 'Premium Course Access', cost: 5000, icon: Gift },
  { id: 2, name: 'Custom Profile Badge', cost: 2000, icon: Medal },
  { id: 3, name: 'Certificate Frame', cost: 3000, icon: Award },
  { id: 4, name: 'Dark Mode Theme', cost: 1500, icon: Star },
];

export default function Gamification() {
  const xpProgress = (userStats.xp / userStats.xpToNextLevel) * 100;

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">Your Learning Journey</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your progress, earn badges, and compete with fellow learners
            </p>
          </motion.div>

          {/* User Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 mb-8 border border-primary/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Level & XP */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">{userStats.level}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="font-semibold text-lg">Rising Star</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{userStats.xp} XP</span>
                    <span>{userStats.xpToNextLevel} XP</span>
                  </div>
                  <Progress value={xpProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {userStats.xpToNextLevel - userStats.xp} XP to next level
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-warning">
                    <Flame className="w-5 h-5" />
                    <span className="text-2xl font-bold">{userStats.streak}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-accent">
                    <Trophy className="w-5 h-5" />
                    <span className="text-2xl font-bold">{userStats.totalBadges}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Badges</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-primary">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-2xl font-bold">#{userStats.rank}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Global Rank</p>
                </div>
              </div>

              {/* Daily Challenges */}
              <div className="md:col-span-2">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Daily Challenges
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {dailyChallenges.map((challenge) => (
                    <div 
                      key={challenge.id}
                      className={`p-3 rounded-lg border ${
                        challenge.completed 
                          ? 'bg-success/10 border-success/30' 
                          : 'bg-card border-border'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {challenge.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">{challenge.title}</span>
                      </div>
                      <p className="text-xs text-primary mt-1">+{challenge.xp} XP</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Badges Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-primary" />
                  Badges & Achievements
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`relative p-4 rounded-xl text-center transition-all ${
                        badge.earned 
                          ? 'bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30' 
                          : 'bg-muted/50 border border-border opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                        badge.earned ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {badge.earned ? (
                          <badge.icon className="w-6 h-6" />
                        ) : (
                          <Lock className="w-5 h-5" />
                        )}
                      </div>
                      <p className="font-medium text-sm">{badge.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                      {badge.earned ? (
                        <p className="text-xs text-primary mt-2">{badge.date}</p>
                      ) : badge.progress !== undefined ? (
                        <div className="mt-2">
                          <Progress value={badge.progress} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1">{badge.progress}%</p>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Crown className="w-6 h-6 text-warning" />
                  Leaderboard
                </h2>
                <div className="space-y-3">
                  {leaderboard.map((user, idx) => (
                    <div
                      key={user.rank}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        user.isCurrentUser ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        user.rank === 1 ? 'bg-warning text-warning-foreground' :
                        user.rank === 2 ? 'bg-muted-foreground text-background' :
                        user.rank === 3 ? 'bg-accent text-accent-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {user.rank}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">{user.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${user.isCurrentUser ? 'text-primary' : ''}`}>
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">Level {user.level}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{user.xp.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">XP</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View Full Leaderboard
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Rewards Shop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Gift className="w-6 h-6 text-primary" />
                  Rewards Shop
                </h2>
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-primary">{userStats.xp} XP</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {rewards.map((reward) => (
                  <div 
                    key={reward.id}
                    className="p-4 bg-muted/50 rounded-xl border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <reward.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-medium">{reward.name}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-primary font-semibold">{reward.cost} XP</span>
                      <Button 
                        size="sm" 
                        variant={userStats.xp >= reward.cost ? 'default' : 'outline'}
                        disabled={userStats.xp < reward.cost}
                      >
                        Redeem
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
