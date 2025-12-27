import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedWidgetContainerProps {
  children: ReactNode;
  roleKey: string;
  className?: string;
}

export function AnimatedWidgetContainer({ 
  children, 
  roleKey, 
  className 
}: AnimatedWidgetContainerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState(roleKey);

  useEffect(() => {
    if (roleKey !== currentKey) {
      // Start exit animation
      setIsVisible(false);
      
      // After exit animation, update key and start enter animation
      const timer = setTimeout(() => {
        setCurrentKey(roleKey);
        setIsVisible(true);
      }, 200);

      return () => clearTimeout(timer);
    } else {
      // Initial mount
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    }
  }, [roleKey, currentKey]);

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4",
        className
      )}
    >
      {children}
    </div>
  );
}

interface StaggeredChildrenProps {
  children: ReactNode[];
  baseDelay?: number;
  staggerDelay?: number;
  className?: string;
}

export function StaggeredChildren({ 
  children, 
  baseDelay = 0, 
  staggerDelay = 50,
  className 
}: StaggeredChildrenProps) {
  return (
    <>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            "animate-fade-in-up opacity-0",
            className
          )}
          style={{
            animationDelay: `${baseDelay + (index * staggerDelay)}ms`,
            animationFillMode: 'forwards'
          }}
        >
          {child}
        </div>
      ))}
    </>
  );
}

interface WidgetCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function WidgetCard({ children, delay = 0, className }: WidgetCardProps) {
  return (
    <div
      className={cn(
        "animate-scale-in opacity-0 bg-card rounded-xl border border-border shadow-sm",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      {children}
    </div>
  );
}
