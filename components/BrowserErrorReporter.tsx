'use client'

import { useEffect } from 'react'

export default function BrowserErrorReporter() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@/lib/utils/browserErrorReporter').then(({ browserErrorReporter }) => {
        // Reporter auto-initializes on import
        console.log('Browser error reporting enabled');
      });
    }
  }, []);

  return null;
}