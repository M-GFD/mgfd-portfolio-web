"use client";

import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  // Keep toast state subscribed so existing hooks continue to work.
  useToast();
  return null;
}
