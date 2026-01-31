import { useCallback, useEffect, useState } from 'react';

export interface GlobalError {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  details?: string;
  timestamp: number;
  canRetry?: boolean;
  onRetry?: () => void;
}

export function useGlobalErrorHandler() {
  const [errors, setErrors] = useState<GlobalError[]>([]);

  const addError = useCallback((
    message: string,
    type: GlobalError['type'] = 'error',
    options?: {
      details?: string;
      canRetry?: boolean;
      onRetry?: () => void;
    }
  ) => {
    const error: GlobalError = {
      id: `error-${Date.now()}-${Math.random()}`,
      message,
      type,
      details: options?.details,
      timestamp: Date.now(),
      canRetry: options?.canRetry,
      onRetry: options?.onRetry
    };

    setErrors((prev) => [...prev, error]);
    return error.id;
  }, []);

  const dismissError = useCallback((id: string) => {
    setErrors((prev) => prev.filter((error) => error.id !== id));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      addError('An unexpected error occurred', 'error', {
        details: event.reason?.message || String(event.reason),
        canRetry: true,
        onRetry: () => window.location.reload()
      });
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      addError('A JavaScript error occurred', 'error', {
        details: event.error?.message || event.message,
        canRetry: true,
        onRetry: () => window.location.reload()
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, [addError]);

  return {
    errors,
    addError,
    dismissError,
    clearAllErrors
  };
}
