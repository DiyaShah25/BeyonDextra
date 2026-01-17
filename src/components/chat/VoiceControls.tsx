import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Loader2, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceControlsProps {
  isPlaying: boolean;
  isRecording: boolean;
  isProcessing: boolean;
  onPlayLastMessage: () => void;
  onStopPlaying: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  hasLastAssistantMessage: boolean;
}

export function VoiceControls({
  isPlaying,
  isRecording,
  isProcessing,
  onPlayLastMessage,
  onStopPlaying,
  onStartRecording,
  onStopRecording,
  hasLastAssistantMessage,
}: VoiceControlsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Text-to-Speech Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={isPlaying ? onStopPlaying : onPlayLastMessage}
        disabled={!hasLastAssistantMessage || isProcessing}
        title={isPlaying ? 'Stop speaking' : 'Read last response aloud'}
        className="relative"
      >
        {isPlaying ? (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <VolumeX className="h-4 w-4" />
          </motion.div>
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>

      {/* Speech-to-Text Button */}
      <Button
        variant={isRecording ? 'destructive' : 'ghost'}
        size="icon"
        onClick={isRecording ? onStopRecording : onStartRecording}
        disabled={isProcessing}
        title={isRecording ? 'Stop recording' : 'Record voice message'}
        className="relative"
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isRecording ? (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="relative"
          >
            <StopCircle className="h-4 w-4" />
            {/* Recording indicator */}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          </motion.div>
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
