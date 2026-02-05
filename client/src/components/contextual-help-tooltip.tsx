import { useState, Suspense, lazy } from "react";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Temporarily disabled due to React hook violation
import { HelpCircleIcon, InfoIcon, CircleHelpIcon } from "lucide-react";
import { StaticTooltipFallback, StaticStatsHelpTooltip, StaticFeatureHelpTooltip, StaticActionButtonFallback } from "@/components/static-tooltip-fallback";
import { AnimatedTooltipLoadingSkeleton } from "@/components/loading-states";

// Lazy load animated components
const LazyAnimatedTooltip = lazy(() => import("@/components/lazy-animated-tooltip").then(module => ({ default: module.LazyAnimatedTooltip })));
const LazyStatsHelpTooltip = lazy(() => import("@/components/lazy-animated-tooltip").then(module => ({ default: module.LazyStatsHelpTooltip })));
const LazyFeatureHelpTooltip = lazy(() => import("@/components/lazy-animated-tooltip").then(module => ({ default: module.LazyFeatureHelpTooltip })));
const LazyAnimatedActionButton = lazy(() => import("@/components/lazy-animated-tooltip").then(module => ({ default: module.LazyAnimatedActionButton })));

interface ContextualHelpTooltipProps {
  content: string | React.ReactNode;
  children?: React.ReactNode;
  type?: "help" | "info" | "question";
  position?: "top" | "bottom" | "left" | "right";
  trigger?: "hover" | "click";
  className?: string;
  iconClassName?: string;
  maxWidth?: string;
}

const iconTypes = {
  help: HelpCircleIcon,
  info: InfoIcon,
  question: CircleHelpIcon,
};

export function ContextualHelpTooltip({
  content,
  children,
  type = "help",
  position = "top",
  trigger = "hover",
  className = "",
  iconClassName = "",
  maxWidth = "max-w-xs"
}: ContextualHelpTooltipProps) {
  return (
    <Suspense 
      fallback={
        <StaticTooltipFallback
          content={content}
          children={children}
          type={type}
          position={position}
          trigger={trigger}
          className={className}
          iconClassName={iconClassName}
          maxWidth={maxWidth}
        />
      }
    >
      <LazyAnimatedTooltip
        content={content}
        children={children}
        type={type}
        position={position}
        trigger={trigger}
        className={className}
        iconClassName={iconClassName}
        maxWidth={maxWidth}
      />
    </Suspense>
  );
}

// Specialized tooltip for form fields
export function FieldHelpTooltip({ 
  content, 
  className = "",
  ...props 
}: Omit<ContextualHelpTooltipProps, 'type'>) {
  return (
    <ContextualHelpTooltip
      content={content}
      type="help"
      position="right"
      className={`bg-blue-900 border-blue-700 ${className}`}
      iconClassName="ml-2"
      {...props}
      data-testid="field-help-tooltip"
    />
  );
}

// Specialized tooltip for dashboard stats
export function StatsHelpTooltip({ 
  content, 
  className = "",
  ...props 
}: Omit<ContextualHelpTooltipProps, 'type'>) {
  return (
    <Suspense 
      fallback={
        <StaticStatsHelpTooltip
          content={content}
          className={className}
          {...props}
        />
      }
    >
      <LazyStatsHelpTooltip
        content={content}
        className={className}
        {...props}
      />
    </Suspense>
  );
}

// Specialized tooltip for feature explanations
export function FeatureHelpTooltip({ 
  content, 
  className = "",
  ...props 
}: Omit<ContextualHelpTooltipProps, 'type'>) {
  return (
    <Suspense 
      fallback={
        <StaticFeatureHelpTooltip
          content={content}
          className={className}
          {...props}
        />
      }
    >
      <LazyFeatureHelpTooltip
        content={content}
        className={className}
        {...props}
      />
    </Suspense>
  );
}

// Interactive tooltip with action button
interface ActionTooltipProps extends ContextualHelpTooltipProps {
  actionText?: string;
  onAction?: () => void;
}

export function ActionTooltip({
  content,
  actionText = "Learn More",
  onAction,
  className = "",
  ...props
}: ActionTooltipProps) {
  const tooltipContent = (
    <div className="space-y-3">
      <div>{content}</div>
      {onAction && (
        <Suspense fallback={<StaticActionButtonFallback onClick={onAction}>{actionText}</StaticActionButtonFallback>}>
          <LazyAnimatedActionButton onClick={onAction}>
            {actionText}
          </LazyAnimatedActionButton>
        </Suspense>
      )}
    </div>
  );

  return (
    <ContextualHelpTooltip
      content={tooltipContent}
      className={`bg-gray-800 border-gray-600 ${className}`}
      maxWidth="max-w-sm"
      {...props}
      data-testid="action-tooltip"
    />
  );
}