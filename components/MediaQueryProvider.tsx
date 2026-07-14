"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function MediaQueryProvider({ children }: { children: React.ReactNode }) {
  useMediaQuery();
  return <>{children}</>;
}
