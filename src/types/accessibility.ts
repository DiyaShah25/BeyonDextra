export interface AccessibilitySettings {
  highContrast: boolean;
  colorBlindMode: boolean;
  dyslexiaFont: boolean;
  largeText: boolean;
  increasedSpacing: boolean;
  reduceMotion: boolean;
  screenReaderOptimized: boolean;
  textToSpeech: boolean;
  speechToText: boolean;
  focusHighlight: boolean;
}

export const defaultAccessibilitySettings: AccessibilitySettings = {
  highContrast: false,
  colorBlindMode: false,
  dyslexiaFont: false,
  largeText: false,
  increasedSpacing: false,
  reduceMotion: false,
  screenReaderOptimized: false,
  textToSpeech: false,
  speechToText: false,
  focusHighlight: true,
};

export type UserRole = 'learner' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  xp: number;
  level: number;
  badges: Badge[];
  completedCourses: string[];
  enrolledCourses: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  modules: Module[];
  enrolledCount: number;
  rating: number;
  category: string;
  accessibilityFeatures: string[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'text' | 'quiz' | 'interactive';
  duration: string;
  completed: boolean;
  hasTranscript: boolean;
  hasSignLanguage: boolean;
  hasAudioDescription: boolean;
}

export interface ForumThread {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  createdAt: Date;
  replies: number;
  views: number;
  category: string;
  isPinned: boolean;
  isSolved: boolean;
}
