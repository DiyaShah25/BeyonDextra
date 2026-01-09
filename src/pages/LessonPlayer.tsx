import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Settings, Maximize, ChevronLeft, ChevronRight, CheckCircle2,
  FileText, MessageSquare, Download, Bookmark, ThumbsUp,
  Clock, BarChart3, ListChecks
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const mockLesson = {
  id: '1',
  title: 'Understanding Screen Readers',
  description: 'Learn how screen readers work and best practices for creating accessible content.',
  duration: '15:32',
  videoUrl: '#',
  transcript: `Welcome to this lesson on understanding screen readers. 
  
Screen readers are assistive technology that converts text and other content into speech or braille output. They are essential tools for people who are blind or have low vision.

In this lesson, we'll cover:
1. How screen readers navigate web pages
2. Common screen reader software
3. Best practices for accessible design
4. Testing your content with screen readers

Let's begin by understanding how screen readers interpret web content...`,
  captions: true,
  signLanguage: true,
  resources: [
    { id: '1', title: 'Screen Reader Cheat Sheet', type: 'pdf', size: '2.4 MB' },
    { id: '2', title: 'WCAG Guidelines Summary', type: 'pdf', size: '1.8 MB' },
    { id: '3', title: 'Practice Exercise Files', type: 'zip', size: '5.2 MB' },
  ],
};

const mockModuleLessons = [
  { id: '1', title: 'Understanding Screen Readers', completed: true, duration: '15:32' },
  { id: '2', title: 'Keyboard Navigation Basics', completed: true, duration: '12:45' },
  { id: '3', title: 'ARIA Labels & Roles', completed: false, current: true, duration: '18:20' },
  { id: '4', title: 'Color Contrast & Visual Design', completed: false, duration: '14:15' },
  { id: '5', title: 'Forms & Input Accessibility', completed: false, duration: '20:00' },
];

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const { settings } = useAccessibility();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(35);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(true);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Top Navigation */}
        <div className="bg-card border-b border-border sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link 
                  to={`/courses/${courseId}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="sr-only sm:not-sr-only">Back to Course</span>
                </Link>
                <div>
                  <h1 className="font-semibold text-foreground">{mockLesson.title}</h1>
                  <p className="text-sm text-muted-foreground">Module 1: Accessibility Fundamentals</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Bookmark className="w-4 h-4 mr-2" />
                  <span className="sr-only sm:not-sr-only">Save</span>
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  <span className="sr-only sm:not-sr-only">Like</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-foreground rounded-xl overflow-hidden aspect-video relative group"
                role="region"
                aria-label="Video player"
              >
                {/* Video Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <div className="text-center text-background">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-medium">Video Player</p>
                    <p className="text-sm opacity-70">Click to play lesson video</p>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                      className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                      aria-label="Video progress"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <button
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                        aria-label="Previous"
                      >
                        <SkipBack className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                        aria-label="Next"
                      >
                        <SkipForward className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <span className="text-white text-sm ml-2">5:26 / {mockLesson.duration}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                        className="bg-transparent text-white text-sm border border-white/30 rounded px-2 py-1"
                        aria-label="Playback speed"
                      >
                        <option value={0.5} className="text-foreground">0.5x</option>
                        <option value={0.75} className="text-foreground">0.75x</option>
                        <option value={1} className="text-foreground">1x</option>
                        <option value={1.25} className="text-foreground">1.25x</option>
                        <option value={1.5} className="text-foreground">1.5x</option>
                        <option value={2} className="text-foreground">2x</option>
                      </select>
                      <button
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                        aria-label="Settings"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                        aria-label="Fullscreen"
                      >
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Accessibility Indicators */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {mockLesson.captions && (
                    <span className="bg-black/60 text-white text-xs px-2 py-1 rounded">CC</span>
                  )}
                  {mockLesson.signLanguage && (
                    <span className="bg-black/60 text-white text-xs px-2 py-1 rounded">ASL</span>
                  )}
                </div>
              </motion.div>

              {/* Tabs Section */}
              <Tabs defaultValue="transcript" className="w-full">
                <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-lg">
                  <TabsTrigger value="transcript" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Transcript
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Resources
                  </TabsTrigger>
                  <TabsTrigger value="discussion" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Discussion
                  </TabsTrigger>
                  <TabsTrigger value="quiz" className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4" />
                    Quiz
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="transcript" className="mt-4">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Lesson Transcript</h3>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                      {mockLesson.transcript}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="mt-4">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold mb-4">Downloadable Resources</h3>
                    <div className="space-y-3">
                      {mockLesson.resources.map((resource) => (
                        <div 
                          key={resource.id}
                          className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium">{resource.title}</p>
                              <p className="text-sm text-muted-foreground">{resource.type.toUpperCase()} • {resource.size}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="discussion" className="mt-4">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold mb-4">Lesson Discussion</h3>
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No discussions yet. Be the first to start a conversation!</p>
                      <Button className="mt-4">Start Discussion</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="quiz" className="mt-4">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold mb-4">Knowledge Check</h3>
                    <div className="space-y-6">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="font-medium mb-3">1. What is the primary function of a screen reader?</p>
                        <div className="space-y-2">
                          {['Display larger text', 'Convert content to speech or braille', 'Add color contrast', 'Slow down animations'].map((option, idx) => (
                            <label key={idx} className="flex items-center gap-3 p-3 bg-background rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                              <input type="radio" name="q1" className="w-4 h-4 text-primary" />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full">Submit Answers</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Lesson List */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border sticky top-20">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold">Module Lessons</h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <BarChart3 className="w-4 h-4" />
                    <span>2 of 5 completed</span>
                  </div>
                  <Progress value={40} className="mt-2" />
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {mockModuleLessons.map((lesson, idx) => (
                    <Link
                      key={lesson.id}
                      to={`/courses/${courseId}/lessons/${lesson.id}`}
                      className={`flex items-start gap-3 p-4 border-b border-border last:border-b-0 transition-colors ${
                        lesson.current ? 'bg-primary/10' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        lesson.completed ? 'bg-success text-success-foreground' : 
                        lesson.current ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {lesson.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-medium">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${lesson.current ? 'text-primary' : ''}`}>
                          {lesson.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    <Button className="flex-1" size="sm">
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
