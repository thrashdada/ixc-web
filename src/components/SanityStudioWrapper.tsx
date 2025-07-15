'use client'

import { NextStudio } from 'next-sanity/studio'
import { useEffect } from 'react'
import type { Config } from 'sanity'

interface SanityStudioWrapperProps {
  config: Config
}

export default function SanityStudioWrapper({ config }: SanityStudioWrapperProps) {
  useEffect(() => {
    // Suppress React warnings for unknown props in development
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && (
        message.includes('disableTransition') ||
        message.includes('React does not recognize')
      )) {
        return;
      }
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && (
        message.includes('disableTransition') ||
        message.includes('React does not recognize')
      )) {
        return;
      }
      originalWarn.apply(console, args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return <NextStudio config={config} />
} 