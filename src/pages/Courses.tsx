import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  CheckCircle2,
  BookOpen,
  Play,
  Youtube,
  Loader2,
  ExternalLink,
  ChevronDown,
  Trophy,
  X,
  ArrowRight,
} from 'lucide-react';
import { useYouTubePlaylists, YouTubePlaylist, YouTubeVideo, QuizQuestion } from '@/hooks/useYouTubePlaylists';
import { useLanguage } from '@/contexts/LanguageContext';

const searchSuggestions = [
  'Web Development Tutorial',
  'Python Programming',
  'Data Science Beginner',
  'Machine Learning',
  'React JS Course',
  'Digital Marketing',
  'UX Design',
  'JavaScript Full Course',
];

// Local progress tracking
function getProgress(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem('yt_progress') || '{}');
  } catch {
    return {};
  }
}

function setProgress(videoId: string, completed: boolean) {
  const p = getProgress();
  p[videoId] = completed;
  localStorage.setItem('yt_progress', JSON.stringify(p));
}

function getPlaylistProgress(videos: YouTubeVideo[]) {
  const p = getProgress();
  const completed = videos.filter(v => p[v.videoId]).length;
  return { completed, total: videos.length, percent: videos.length > 0 ? Math.round((completed / videos.length) * 100) : 0 };
}

export default function CoursesPage() {
  const { currentLanguage } = useLanguage();
  const { playlists, loading, error, searchPlaylists, generateQuiz } = useYouTubePlaylists();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(null);

  // Quiz state
  const [quizVideo, setQuizVideo] = useState<YouTubeVideo | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [_, setForceUpdate] = useState(0);

  const handleSearch = async (query?: string) => {
    const q = query || searchQuery;
    if (!q.trim()) return;
    setSearchQuery(q);
    setHasSearched(true);
    setExpandedPlaylist(null);
    const langSuffix = currentLanguage !== 'en' ? ` ${currentLanguage}` : '';
    await searchPlaylists(q + langSuffix, 6);
  };

  // Video player state
  const [playingVideo, setPlayingVideo] = useState<YouTubeVideo | null>(null);

  const openVideo = (video: YouTubeVideo) => {
    setPlayingVideo(video);
    setProgress(video.videoId, true);
    setForceUpdate(p => p + 1);
  };

  const closeVideo = () => {
    setPlayingVideo(null);
  };

  const startQuiz = async (video: YouTubeVideo) => {
    setQuizVideo(video);
    setQuizLoading(true);
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizFinished(false);

    const questions = await generateQuiz(video.title, video.description);
    setQuizQuestions(questions);
    setQuizLoading(false);
  };

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    if (idx === quizQuestions[currentQuestion].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
    }
  };

  const closeQuiz = () => {
    setQuizVideo(null);
    setQuizQuestions([]);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
              Learn from <span className="text-gradient">YouTube Playlists</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Search for any topic, watch curated playlists, track your progress, and test your knowledge with AI-generated quizzes after each video.
            </p>

            {/* Search */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search YouTube playlists..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 text-base"
                  aria-label="Search YouTube playlists"
                />
              </div>
              <Button onClick={() => handleSearch()} size="lg" disabled={loading} className="h-12">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
              </Button>
            </div>

            {/* Suggestions */}
            {!hasSearched && (
              <div className="flex flex-wrap gap-2 mt-4">
                {searchSuggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSearch(s)}
                    className="px-3 py-1.5 rounded-full text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Searching YouTube playlists...</p>
            </div>
          )}

          {!loading && hasSearched && playlists.length === 0 && (
            <div className="text-center py-16">
              <Youtube className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No playlists found</h3>
              <p className="text-muted-foreground">Try a different search term.</p>
            </div>
          )}

          {!loading && playlists.length > 0 && (
            <>
              <p className="text-muted-foreground mb-6">
                Found {playlists.length} playlists for "{searchQuery}"
              </p>

              <div className="space-y-6">
                {playlists.map((playlist, idx) => {
                  const prog = getPlaylistProgress(playlist.videos);
                  const isExpanded = expandedPlaylist === playlist.playlistId;

                  return (
                    <motion.article
                      key={playlist.playlistId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="card-interactive overflow-hidden"
                    >
                      {/* Playlist header */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative w-full sm:w-64 flex-shrink-0">
                          <img
                            src={playlist.thumbnail}
                            alt={playlist.title}
                            className="w-full aspect-video object-cover rounded-lg"
                          />
                          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                            {playlist.videoCount} videos
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{playlist.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{playlist.channelTitle}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{playlist.description}</p>

                          {/* Progress */}
                          {prog.completed > 0 && (
                            <div className="mb-3">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>{prog.completed}/{prog.total} completed</span>
                                <span>{prog.percent}%</span>
                              </div>
                              <Progress value={prog.percent} className="h-1.5" />
                            </div>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedPlaylist(isExpanded ? null : playlist.playlistId)}
                          >
                            {isExpanded ? 'Hide' : 'View'} Lessons
                            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        </div>
                      </div>

                      {/* Expanded videos */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-border space-y-2">
                              {playlist.videos.map((video, vIdx) => {
                                const isWatched = getProgress()[video.videoId];
                                return (
                                  <div
                                    key={video.videoId}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                      isWatched ? 'bg-success/10' : 'hover:bg-muted/50'
                                    }`}
                                  >
                                    <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                                      isWatched ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                                    }`}>
                                      {isWatched ? <CheckCircle2 className="w-4 h-4" /> : vIdx + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm line-clamp-1">{video.title}</p>
                                      <p className="text-xs text-muted-foreground">{video.channelTitle}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => startQuiz(video)}
                                        className="text-xs"
                                      >
                                        <BookOpen className="w-3.5 h-3.5 mr-1" />
                                        Quiz
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => openVideo(video)}
                                      >
                                        <Play className="w-3.5 h-3.5 mr-1" />
                                        Watch
                                        <ExternalLink className="w-3 h-3 ml-1" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.article>
                  );
                })}
              </div>
            </>
          )}

          {!hasSearched && !loading && (
            <div className="text-center py-16">
              <Youtube className="w-20 h-20 text-primary/30 mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Search for a topic to get started</h3>
              <p className="text-muted-foreground">
                Find YouTube playlists, track your learning progress, and take quizzes after each video.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Quiz Modal */}
      <AnimatePresence>
        {quizVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={closeQuiz}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl border border-border max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-display font-bold text-lg">Video Quiz</h2>
                  <p className="text-sm text-muted-foreground line-clamp-1">{quizVideo.title}</p>
                </div>
                <button onClick={closeQuiz} className="p-1 hover:bg-muted rounded-md">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {quizLoading && (
                <div className="flex flex-col items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                  <p className="text-muted-foreground text-sm">Generating quiz from video content...</p>
                </div>
              )}

              {!quizLoading && quizQuestions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Could not generate quiz. Try again.</p>
                  <Button className="mt-4" onClick={() => startQuiz(quizVideo)}>Retry</Button>
                </div>
              )}

              {!quizLoading && quizQuestions.length > 0 && !quizFinished && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </span>
                    <span className="text-sm font-medium text-primary">Score: {score}</span>
                  </div>
                  <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="h-1.5 mb-6" />

                  <p className="font-semibold mb-4">{quizQuestions[currentQuestion].question}</p>

                  <div className="space-y-2">
                    {quizQuestions[currentQuestion].options.map((opt, i) => {
                      let variant = 'outline' as const;
                      let extraClass = '';
                      if (showResult) {
                        if (i === quizQuestions[currentQuestion].correctIndex) {
                          extraClass = 'border-success bg-success/10 text-success';
                        } else if (i === selectedAnswer) {
                          extraClass = 'border-destructive bg-destructive/10 text-destructive';
                        }
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswer(i)}
                          disabled={showResult}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${extraClass || 'border-border hover:bg-muted/50'} ${
                            selectedAnswer === i && !showResult ? 'border-primary bg-primary/10' : ''
                          }`}
                        >
                          <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {showResult && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {quizQuestions[currentQuestion].explanation}
                      </p>
                      <Button className="mt-3 w-full" onClick={nextQuestion}>
                        {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {quizFinished && (
                <div className="text-center py-6">
                  <Trophy className={`w-16 h-16 mx-auto mb-4 ${score >= quizQuestions.length * 0.7 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                  <h3 className="font-display font-bold text-2xl mb-1">
                    {score} / {quizQuestions.length}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    {score >= quizQuestions.length * 0.7 ? 'Great job! You passed!' : 'Keep learning and try again.'}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    {Math.round((score / quizQuestions.length) * 100)}% correct
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={closeQuiz}>Close</Button>
                    <Button onClick={() => startQuiz(quizVideo)}>Retake Quiz</Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Player Modal */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={closeVideo}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold line-clamp-1 flex-1 mr-4">{playingVideo.title}</h3>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.youtube.com/watch?v=${playingVideo.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white text-sm flex items-center gap-1"
                  >
                    Open on YouTube <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button onClick={closeVideo} className="text-white/70 hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${playingVideo.videoId}?autoplay=1`}
                  title={playingVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
