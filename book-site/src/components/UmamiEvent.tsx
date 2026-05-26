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
  useEffect(() => {
    window.umami?.track(event, data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
