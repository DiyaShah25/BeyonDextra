import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit, Camera,
  BookOpen, Trophy, Clock, Star, Shield, Bell, Palette
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AccessibilityPanel } from '@/components/accessibility/AccessibilityPanel';

const userProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  joinDate: 'January 2024',
  bio: 'Passionate about accessible design and inclusive technology. Currently learning web development with a focus on creating experiences that work for everyone.',
  stats: {
    coursesCompleted: 8,
    hoursLearned: 124,
    badges: 15,
    streak: 7,
  },
};

const enrolledCourses = [
  { id: 1, title: 'Web Accessibility Fundamentals', progress: 85, lastAccessed: '2 days ago' },
  { id: 2, title: 'Inclusive Design Principles', progress: 60, lastAccessed: '1 week ago' },
  { id: 3, title: 'WCAG 2.2 Deep Dive', progress: 30, lastAccessed: '3 days ago' },
];

const certificates = [
  { id: 1, title: 'Web Accessibility Certified', issueDate: 'Dec 2024', verified: true },
  { id: 2, title: 'Inclusive Design Professional', issueDate: 'Nov 2024', verified: true },
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-card rounded-xl p-6 border border-border">
                {/* Avatar */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">
                      {userProfile.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <button 
                    className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors"
                    aria-label="Change profile picture"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Name & Email */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold">{userProfile.name}</h2>
                  <p className="text-muted-foreground">{userProfile.email}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <BookOpen className="w-5 h-5 mx-auto text-primary mb-1" />
                    <p className="text-xl font-bold">{userProfile.stats.coursesCompleted}</p>
                    <p className="text-xs text-muted-foreground">Courses</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Clock className="w-5 h-5 mx-auto text-primary mb-1" />
                    <p className="text-xl font-bold">{userProfile.stats.hoursLearned}</p>
                    <p className="text-xs text-muted-foreground">Hours</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Trophy className="w-5 h-5 mx-auto text-warning mb-1" />
                    <p className="text-xl font-bold">{userProfile.stats.badges}</p>
                    <p className="text-xs text-muted-foreground">Badges</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Star className="w-5 h-5 mx-auto text-accent mb-1" />
                    <p className="text-xl font-bold">{userProfile.stats.streak}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{userProfile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{userProfile.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {userProfile.joinDate}</span>
                  </div>
                </div>

                <Button className="w-full mt-6" variant="outline" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-card border border-border p-1">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="courses" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Courses
                  </TabsTrigger>
                  <TabsTrigger value="certificates" className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Certificates
                  </TabsTrigger>
                  <TabsTrigger value="accessibility" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Accessibility
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Bio */}
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold mb-3">About Me</h3>
                    {isEditing ? (
                      <textarea 
                        className="w-full p-3 rounded-lg border border-border bg-background min-h-[100px]"
                        defaultValue={userProfile.bio}
                      />
                    ) : (
                      <p className="text-muted-foreground">{userProfile.bio}</p>
                    )}
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {enrolledCourses.slice(0, 2).map((course) => (
                        <div key={course.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{course.title}</p>
                            <p className="text-xs text-muted-foreground">Last accessed {course.lastAccessed}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{course.progress}%</p>
                            <Progress value={course.progress} className="w-20 h-1 mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Account Settings Preview */}
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold mb-4">Account Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium text-sm">Two-Factor Auth</p>
                            <p className="text-xs text-muted-foreground">Enabled</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Manage</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium text-sm">Notifications</p>
                            <p className="text-xs text-muted-foreground">Email & Push</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Manage</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="courses" className="space-y-6">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold mb-4">Enrolled Courses</h3>
                    <div className="space-y-4">
                      {enrolledCourses.map((course) => (
                        <div key={course.id} className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-medium">{course.title}</p>
                              <p className="text-sm text-muted-foreground">Last accessed {course.lastAccessed}</p>
                            </div>
                            <Button size="sm">Continue</Button>
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress value={course.progress} className="flex-1" />
                            <span className="text-sm font-medium">{course.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="certificates" className="space-y-6">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold mb-4">My Certificates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {certificates.map((cert) => (
                        <div 
                          key={cert.id}
                          className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/20"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <Trophy className="w-8 h-8 text-primary" />
                            {cert.verified && (
                              <span className="px-2 py-1 bg-success/20 text-success text-xs rounded-full">
                                Verified
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold">{cert.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">Issued {cert.issueDate}</p>
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="outline">Download</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="accessibility" className="space-y-6">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <AccessibilityPanel />
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
