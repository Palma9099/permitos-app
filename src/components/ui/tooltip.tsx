"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface TooltipContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextType | undefined>(
  undefined
);

const useTooltipContext = () => {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error("useTooltipContext must be used within TooltipProvider");
  }
  return context;
};

const TooltipProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <TooltipContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={ref} {...props} />
    </TooltipContext.Provider>
  );
});
TooltipProvider.displayName = "TooltipProvider";

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  delayDuration?: number;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ delayDuration = 200, ...props }, ref) => (
    <div ref={ref} {...props} />
  )
);
Tooltip.displayName = "Tooltip";

interface TooltipTriggerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const TooltipTrigger = React.forwardRef<HTMLDivElement, TooltipTriggerProps>(
  ({ onMouseEnter, onMouseLeave, ...props }, ref) => {
    const { setIsOpen } = useTooltipContext();
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(true);
      }, 200);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsOpen(false);
      onMouseLeave?.(e);
    };

    return (
      <div
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    );
  }
);
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isOpen } = useTooltipContext();

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-md",
        className
      )}
      {...props}
    />
  );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
