"use client";

import React, { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--desk-gradient, #3d2b1f)",
            padding: 40,
          }}
        >
          <div
            style={{
              maxWidth: 420,
              textAlign: "center",
              background: "var(--paper-bg, #f5f0e8)",
              borderRadius: 16,
              padding: "48px 40px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                margin: "0 auto 20px",
                borderRadius: "50%",
                background: "rgba(180,60,40,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              !
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif, serif)",
                fontSize: 22,
                fontWeight: 400,
                color: "var(--text-primary, #2c2416)",
                margin: "0 0 12px",
              }}
            >
              {this.props.fallbackTitle || "Something went wrong"}
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-secondary, #5a4d3a)",
                lineHeight: 1.6,
                margin: "0 0 24px",
              }}
            >
              {this.props.fallbackMessage ||
                "The PDF viewer encountered an unexpected error. Your document is safe — try reloading or going back."}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={this.handleReset}
                style={{
                  fontFamily: "var(--font-serif, serif)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--text-secondary, #5a4d3a)",
                  background: "transparent",
                  border: "1px solid var(--border-subtle, #d4cfc4)",
                  borderRadius: 10,
                  padding: "12px 28px",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139,105,20,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                style={{
                  fontFamily: "var(--font-serif, serif)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--paper-bg, #f5f0e8)",
                  background: "var(--accent, #8b6914)",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 28px",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent-hover, #a07a18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--accent, #8b6914)";
                }}
              >
                Reload App
              </button>
            </div>
            {this.state.error && (
              <details style={{ marginTop: 20, textAlign: "left" }}>
                <summary
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted, #8a7d6b)",
                    cursor: "pointer",
                  }}
                >
                  Technical details
                </summary>
                <pre
                  style={{
                    fontSize: 10,
                    color: "var(--text-muted, #8a7d6b)",
                    marginTop: 8,
                    overflow: "auto",
                    maxHeight: 120,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                  }}
                >
                  {this.state.error.message}
                  {"\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
