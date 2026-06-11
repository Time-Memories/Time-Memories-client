import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Component, Suspense, type ErrorInfo, type ReactNode } from 'react';

export type AsyncBoundaryVariant = 'screen' | 'section' | 'inline';

interface LoadingDotsProps {
  className?: string;
}

export const LoadingDots = ({ className = '' }: LoadingDotsProps) => (
  <div className={`tm-dot-loader ${className}`} aria-hidden="true">
    <span className="tm-dot-loader__dot" />
    <span className="tm-dot-loader__dot" />
    <span className="tm-dot-loader__dot" />
  </div>
);

export interface SuspenseFallbackProps {
  variant?: AsyncBoundaryVariant;
  label?: string;
  className?: string;
}

const suspenseFallbackClass: Record<AsyncBoundaryVariant, string> = {
  screen: 'fixed inset-0 z-50 min-h-svh bg-[#1c2333]/15 backdrop-blur-[1px]',
  section: 'min-h-40 w-full flex-1 bg-[#1c2333]/10 backdrop-blur-[1px]',
  inline: 'w-full py-4 bg-[#1c2333]/5',
};

export const SuspenseFallback = ({
  variant = 'section',
  label = '불러오는 중...',
  className = '',
}: SuspenseFallbackProps) => (
  <div
    role="status"
    aria-live="polite"
    className={`flex items-center justify-center ${suspenseFallbackClass[variant]} ${className}`}
  >
    <LoadingDots />
    <span className="sr-only">{label}</span>
  </div>
);

export interface ErrorFallbackProps {
  error?: unknown;
  onReset?: () => void;
  variant?: AsyncBoundaryVariant;
  className?: string;
}

const errorFallbackClass: Record<AsyncBoundaryVariant, string> = {
  screen: 'fixed inset-0 z-50 min-h-svh bg-white/90 px-6',
  section: 'min-h-40 w-full flex-1 bg-white/90 px-5',
  inline: 'w-full py-4 px-4',
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.';
}

export const ErrorFallback = ({
  error,
  onReset,
  variant = 'section',
  className = '',
}: ErrorFallbackProps) => (
  <div
    role="alert"
    className={`flex items-center justify-center ${errorFallbackClass[variant]} ${className}`}
  >
    <div className="flex max-w-[280px] flex-col items-center gap-2 text-center">
      <p className="text-[#1c2333] text-[14px] font-bold">문제가 발생했어요</p>
      <p className="text-[#6b7280] text-[12px] leading-[18px]">{getErrorMessage(error)}</p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-1 rounded-[12px] bg-[#1c2333] px-4 py-2 text-[12px] font-semibold text-white hover:opacity-90 transition-opacity"
        >
          다시 시도
        </button>
      )}
    </div>
  </div>
);

function normalizeError(error: unknown): Error {
  return error instanceof Error ? error : new Error('알 수 없는 오류가 발생했습니다.');
}

function didResetKeysChange(prevKeys: unknown[] = [], nextKeys: unknown[] = []): boolean {
  if (prevKeys.length !== nextKeys.length) return true;
  return prevKeys.some((key, index) => !Object.is(key, nextKeys[index]));
}

export interface ErrorBoundaryFallbackProps {
  error: Error;
  reset: () => void;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (props: ErrorBoundaryFallbackProps) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: unknown[];
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error: normalizeError(error) };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.error && didResetKeysChange(prevProps.resetKeys, this.props.resetKeys)) {
      this.props.onReset?.();
      this.setState({ error: null });
    }
  }

  reset = () => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render() {
    const { children, fallback } = this.props;
    const { error } = this.state;

    if (error) {
      if (fallback) {
        return fallback({ error, reset: this.reset });
      }

      return <ErrorFallback error={error} onReset={this.reset} />;
    }

    return children;
  }
}

export interface AsyncBoundaryProps {
  children: ReactNode;
  errorFallback?: (props: ErrorBoundaryFallbackProps) => ReactNode;
  errorVariant?: AsyncBoundaryVariant;
  fallback?: ReactNode;
  fallbackVariant?: AsyncBoundaryVariant;
  resetKeys?: unknown[];
}

export const AsyncBoundary = ({
  children,
  errorFallback,
  errorVariant,
  fallback,
  fallbackVariant = 'section',
  resetKeys,
}: AsyncBoundaryProps) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        resetKeys={resetKeys}
        onReset={reset}
        fallback={(props) =>
          errorFallback?.(props) ?? (
            <ErrorFallback
              error={props.error}
              onReset={props.reset}
              variant={errorVariant ?? fallbackVariant}
            />
          )
        }
      >
        <Suspense fallback={fallback ?? <SuspenseFallback variant={fallbackVariant} />}>
          {children}
        </Suspense>
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);
