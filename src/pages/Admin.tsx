import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, BarChart3, Settings, Shield, Bell,
  TrendingUp, TrendingDown, Eye, Edit, Trash2, Plus,
  Search, Filter, Download, Upload, MoreVertical,
  UserCheck, UserX, GraduationCap, MessageSquare, AlertTriangle
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const statsCards = [
  { label: 'Total Users', value: '12,847', change: '+12%', trend: 'up', icon: Users },
  { label: 'Active Courses', value: '156', change: '+8%', trend: 'up', icon: BookOpen },
  { label: 'Completion Rate', value: '78%', change: '+5%', trend: 'up', icon: GraduationCap },
  { label: 'Support Tickets', value: '23', change: '-15%', trend: 'down', icon: MessageSquare },
];

const recentUsers = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Learner', status: 'active', joined: '2 hours ago' },
  { id: 2, name: 'Michael Chen', email: 'michael@example.com', role: 'Instructor', status: 'active', joined: '5 hours ago' },
  { id: 3, name: 'Emily Davis', email: 'emily@example.com', role: 'Learner', status: 'pending', joined: '1 day ago' },
  { id: 4, name: 'James Wilson', email: 'james@example.com', role: 'Learner', status: 'active', joined: '2 days ago' },
  { id: 5, name: 'Lisa Anderson', email: 'lisa@example.com', role: 'Instructor', status: 'inactive', joined: '3 days ago' },
];

const recentCourses = [
  { id: 1, title: 'Web Accessibility Fundamentals', instructor: 'Michael Chen', students: 234, status: 'published', rating: 4.8 },
  { id: 2, title: 'Inclusive Design Principles', instructor: 'Lisa Anderson', students: 189, status: 'published', rating: 4.6 },
  { id: 3, title: 'WCAG 2.2 Deep Dive', instructor: 'David Kim', students: 0, status: 'draft', rating: null },
  { id: 4, title: 'Assistive Technology Overview', instructor: 'Sarah Johnson', students: 156, status: 'published', rating: 4.9 },
];

const alerts = [
  { id: 1, type: 'warning', message: 'High server load detected', time: '10 min ago' },
  { id: 2, type: 'info', message: '5 new instructor applications pending', time: '1 hour ago' },
  { id: 3, type: 'success', message: 'Database backup completed', time: '3 hours ago' },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your platform and monitor activity</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsCards.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${
                      stat.trend === 'up' ? 'text-success' : 'text-destructive'
                    }`}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{stat.change} from last month</span>
                    </div>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card border border-border p-1">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Chart Placeholder */}
                <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border">
                  <h3 className="font-semibold mb-4">User Activity</h3>
                  <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Activity chart visualization</p>
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">System Alerts</h3>
                    <Bell className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div 
                        key={alert.id}
                        className={`p-3 rounded-lg border ${
                          alert.type === 'warning' ? 'bg-warning/10 border-warning/30' :
                          alert.type === 'success' ? 'bg-success/10 border-success/30' :
                          'bg-muted/50 border-border'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                            alert.type === 'warning' ? 'text-warning' :
                            alert.type === 'success' ? 'text-success' :
                            'text-muted-foreground'
                          }`} />
                          <div>
                            <p className="text-sm font-medium">{alert.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="font-semibold mb-4">Course Completion by Category</h3>
                  <div className="space-y-4">
                    {[
                      { category: 'Accessibility', progress: 85 },
                      { category: 'Design', progress: 72 },
                      { category: 'Development', progress: 68 },
                      { category: 'Testing', progress: 54 },
                    ].map((item) => (
                      <div key={item.category}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{item.category}</span>
                          <span className="text-sm text-muted-foreground">{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="font-semibold mb-4">Top Performing Courses</h3>
                  <div className="space-y-3">
                    {recentCourses.filter(c => c.rating).slice(0, 4).map((course, idx) => (
                      <div key={course.id} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{course.title}</p>
                          <p className="text-xs text-muted-foreground">{course.students} students</p>
                        </div>
                        <span className="text-sm font-medium">⭐ {course.rating}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <div className="bg-card rounded-xl border border-border">
                <div className="p-4 border-b border-border">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Search users..." className="pl-9" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Import
                      </Button>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full" role="table">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Joined</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-medium">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'Instructor' ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`flex items-center gap-1 text-sm ${
                              user.status === 'active' ? 'text-success' :
                              user.status === 'pending' ? 'text-warning' :
                              'text-muted-foreground'
                            }`}>
                              {user.status === 'active' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                              {user.status}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{user.joined}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" aria-label="View user">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" aria-label="Edit user">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" aria-label="More options">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              <div className="bg-card rounded-xl border border-border">
                <div className="p-4 border-b border-border">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Search courses..." className="pl-9" />
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Course
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full" role="table">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium text-muted-foreground">Course</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Instructor</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Students</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Rating</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCourses.map((course) => (
                        <tr key={course.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                          <td className="p-4">
                            <p className="font-medium">{course.title}</p>
                          </td>
                          <td className="p-4 text-muted-foreground">{course.instructor}</td>
                          <td className="p-4">{course.students}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              course.status === 'published' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                            }`}>
                              {course.status}
                            </span>
                          </td>
                          <td className="p-4">{course.rating ? `⭐ ${course.rating}` : '-'}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" aria-label="View course">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" aria-label="Edit course">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" aria-label="Delete course">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Security Settings</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Session Timeout</p>
                        <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                      </div>
                      <Button variant="outline" size="sm">30 min</Button>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <Bell className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Notification Settings</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                      </div>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Reports</p>
                        <p className="text-sm text-muted-foreground">Automated analytics summary</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
