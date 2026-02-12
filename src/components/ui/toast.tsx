"use client";

import * as React from "react";

export type ToastActionElement = React.ReactElement;

export type ToastProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
  className?: string;
  children?: React.ReactNode;
};

export function Toast({ children }: ToastProps) {
  return <>{children}</>;
}
