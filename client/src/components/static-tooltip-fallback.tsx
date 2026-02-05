import { useState } from "react";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Temporarily disabled due to React hook violation
import { HelpCircleIcon, InfoIcon, CircleHelpIcon } from "lucide-react";

interface StaticTooltipProps {
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

export function StaticTooltipFallback({
  content,
  children,
  type = "help",
  position = "top",
  trigger = "hover",
  className = "",
  iconClassName = "",
  maxWidth = "max-w-xs"
}: StaticTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const IconComponent = iconTypes[type];

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const triggerElement = children || (
    <button
      className={`
        inline-flex items-center justify-center rounded-full p-1
        text-gray-500 hover:text-blue-600 hover:bg-blue-50
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${iconClassName}
      `}
      data-testid={`static-tooltip-${type}-icon`}
    >
      <IconComponent className="w-4 h-4" />
    </button>
  );

  // Temporarily return simple fallback without tooltip functionality due to React hook violations
  return (
    <div className="relative inline-flex">
      {triggerElement}
      {/* Tooltip functionality temporarily disabled */}
    </div>
  );
}

// Static specialized tooltips
export function StaticStatsHelpTooltip({ 
  content, 
  className = "",
  ...props 
}: Omit<StaticTooltipProps, 'type'>) {
  return (
    <StaticTooltipFallback
      content={content}
      type="info"
      position="top"
      className={`bg-green-900 border-green-700 ${className}`}
      iconClassName="ml-1"
      maxWidth="max-w-sm"
      {...props}
      data-testid="static-stats-help-tooltip"
    />
  );
}

export function StaticFeatureHelpTooltip({ 
  content, 
  className = "",
  ...props 
}: Omit<StaticTooltipProps, 'type'>) {
  return (
    <StaticTooltipFallback
      content={content}
      type="question"
      position="bottom"
      className={`bg-purple-900 border-purple-700 ${className}`}
      maxWidth="max-w-md"
      {...props}
      data-testid="static-feature-help-tooltip"
    />
  );
}

// Static action button fallback
interface StaticActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function StaticActionButtonFallback({
  children,
  onClick,
  className = "",
  disabled = false
}: StaticActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 
        text-white text-xs rounded-md transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      data-testid="static-action-button"
    >
      {children}
    </button>
  );
}

// Static container fallback
interface StaticContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function StaticContainerFallback({
  children,
  className = "",
  delay = 0
}: StaticContainerProps) {
  return (
    <div
      className={className}
      data-testid="static-container"
    >
      {children}
    </div>
  );
}