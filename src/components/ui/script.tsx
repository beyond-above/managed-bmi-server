
import { useEffect, useState } from 'react';

interface ScriptProps {
  src: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const Script = ({ src, onLoad, onError }: ScriptProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${src}"]`);
    
    if (existingScript) {
      setLoaded(true);
      onLoad?.();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    script.onload = () => {
      setLoaded(true);
      onLoad?.();
    };

    script.onerror = (e) => {
      const error = new Error(`Failed to load script: ${src}`);
      setError(error);
      onError?.(error);
    };

    document.body.appendChild(script);

    return () => {
      // We don't remove the script to avoid issues with cached scripts
    };
  }, [src, onLoad, onError]);

  return null;
};
