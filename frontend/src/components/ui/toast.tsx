import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const ToastProvider = ToastPrimitive.Provider;

export function ToastViewport({ className, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      className={cn("fixed bottom-0 right-0 z-[100] flex w-full max-w-sm flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

const toastVariants = cva(
  "pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border p-4 shadow-lg animate-in slide-in-from-bottom-4 fade-in-0",
  {
    variants: {
      variant: {
        default: "border-brand-100 bg-white text-slate-800",
        success: "border-success-500/30 bg-white text-slate-800",
        celebration: "border-xp-500/40 bg-gradient-to-br from-white to-brand-50 text-slate-800",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitive.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
));
Toast.displayName = "Toast";

export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
));
ToastTitle.displayName = "ToastTitle";

export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description ref={ref} className={cn("text-xs text-slate-500", className)} {...props} />
));
ToastDescription.displayName = "ToastDescription";

export const ToastClose = ToastPrimitive.Close;
export type ToastActionElement = React.ReactElement;
