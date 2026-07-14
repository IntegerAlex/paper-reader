"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Info, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  toast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const toast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: <Check size={14} />,
    error: <AlertCircle size={14} />,
    info: <Info size={14} />,
  };

  const colors = isDark
    ? {
        success: { bg: "rgba(34,139,34,0.2)", border: "rgba(34,139,34,0.3)", text: "#5cb85c" },
        error: { bg: "rgba(220,20,60,0.2)", border: "rgba(220,20,60,0.3)", text: "#f08080" },
        info: { bg: "rgba(196,152,26,0.2)", border: "rgba(196,152,26,0.3)", text: "#dab530" },
      }
    : {
        success: { bg: "rgba(34,139,34,0.12)", border: "rgba(34,139,34,0.2)", text: "#228b22" },
        error: { bg: "rgba(220,20,60,0.12)", border: "rgba(220,20,60,0.2)", text: "#dc143c" },
        info: { bg: "rgba(139,105,20,0.12)", border: "rgba(139,105,20,0.2)", text: "#8b6914" },
      };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: "fixed", bottom: 60, right: 20, zIndex: 200, display: "flex", flexDirection: "column", gap: 8 }}>
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                borderRadius: 10,
                background: colors[t.type].bg,
                border: `1px solid ${colors[t.type].border}`,
                backdropFilter: "blur(12px)",
                boxShadow: isDark
                  ? "0 4px 16px rgba(0,0,0,0.4)"
                  : "0 4px 16px rgba(0,0,0,0.12)",
                fontSize: 13,
                fontWeight: 500,
                color: colors[t.type].text,
                maxWidth: 320,
              }}
            >
              {icons[t.type]}
              <span style={{ flex: 1 }}>{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                aria-label={`Dismiss notification: ${t.message}`}
                style={{ background: "none", border: "none", cursor: "pointer", color: colors[t.type].text, opacity: 0.6, padding: 2 }}
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
