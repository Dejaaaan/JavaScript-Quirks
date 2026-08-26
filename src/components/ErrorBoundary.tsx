import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '';
    window.location.reload();
  };

  private handleReturnHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '';
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1C1C1F] border border-amber-500/30 dark:border-amber-500/20 shadow-xl space-y-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-[#78350F] dark:text-[#F59E0B] flex items-center justify-center mx-auto border border-amber-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold font-mono text-[#1A1A1A] dark:text-[#F4F4F5]">
                {this.props.fallbackTitle || 'Runtime Execution Notice'}
              </h2>
              <p className="text-xs sm:text-sm text-[#3F3F3C] dark:text-[#D4D4D8] leading-relaxed">
                An unexpected error occurred during execution. You can reset the active view or return to the main topics catalog.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-lg bg-[#F4F4F0] dark:bg-[#121214] border border-[#E5E5DF] dark:border-[#27272A] text-left overflow-auto max-h-32">
                <p className="font-mono text-xs text-rose-600 dark:text-rose-400 break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReturnHome}
                className="px-4 py-2 rounded-xl border border-[#D4D4CE] dark:border-[#3F3F46] bg-[#FFFFFF] dark:bg-[#27272A] text-xs font-semibold text-[#1A1A1A] dark:text-[#F4F4F5] hover:bg-[#F4F4F0] dark:hover:bg-[#333338] transition flex items-center gap-1.5 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Catalog</span>
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-xl bg-[#78350F] dark:bg-[#F59E0B] text-white dark:text-[#18181B] text-xs font-semibold hover:bg-[#5E2A0C] dark:hover:bg-[#D97706] transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
