import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class FirestoreErrorBoundary extends React.Component<Props, State> {
  declare readonly props: Readonly<Props>;

  public state: State = {
    hasError: false,
    errorMessage: "",
  };

  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(error: Error): State {
    let msg = error.message || "Unexpected application error.";
    try {
      const parsed = JSON.parse(msg);
      if (parsed && parsed.error && parsed.operationType) {
        msg = `Database permission or sync error during ${parsed.operationType} on ${parsed.path || "resource"}: ${parsed.error}`;
      }
    } catch {
      // plain string message
    }
    return { hasError: true, errorMessage: msg };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught UI error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F3F7FF] text-[#0B1230] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-[#0A2EB8]/20 rounded-3xl p-7 shadow-lg text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-300 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#0B1230]">
              Something went out of sync
            </h2>
            <p className="text-sm text-[#0B1230]/75 leading-relaxed break-words">
              {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-3 px-5 rounded-full bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-extrabold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Happy Hangouts</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
