import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, X } from 'lucide-react';
import { AccessibilityPanel } from './AccessibilityPanel';

export function AccessibilityToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
        aria-label="Open accessibility settings"
        aria-haspopup="dialog"
      >
        <Accessibility className="w-5 h-5" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card shadow-lg z-50 overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="accessibility-title"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 id="accessibility-title" className="text-xl font-semibold flex items-center gap-2">
                    <Accessibility className="w-5 h-5 text-primary" aria-hidden="true" />
                    Accessibility Settings
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Close accessibility settings"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>

                <AccessibilityPanel onClose={() => setIsOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
