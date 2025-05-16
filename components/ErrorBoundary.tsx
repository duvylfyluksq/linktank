import React from "react";

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  // 1) Explicitly type your state here
  state: ErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    const { error } = this.state;

    if (error instanceof Error) {
      return (
        <div style={{ padding: 16 }}>
          <h2>❌ Something went wrong</h2>
          <pre style={{ whiteSpace: "pre-wrap", color: "red" }}>
            {error.message}
            {"\n\n"}
            {error.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
