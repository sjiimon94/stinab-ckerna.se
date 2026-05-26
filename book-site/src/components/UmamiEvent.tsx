"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

interface UmamiEventProps {
  event: string;
  data?: Record<string, unknown>;
}

export default function UmamiEvent({ event, data }: UmamiEventProps) {
  // Intentionally run once on mount only – we want a single tracking call
  // per page load, not on every re-render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    window.umami?.track(event, data);
  }, []);

  return null;
}
