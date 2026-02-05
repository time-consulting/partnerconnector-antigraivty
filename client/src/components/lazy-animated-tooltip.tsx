import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Temporarily disabled due to React hook violation
import { HelpCircleIcon, InfoIcon, CircleHelpIcon } from "lucide-react";

interface LazyAnimatedTooltipProps {
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

export function LazyAnimatedTooltip({
  content,
  children,
  type = "help",
  position = "top",
  trigger = "hover",
  className = "",
  iconClassName = "",
  maxWidth = "max-w-xs"
}: LazyAnimatedTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const IconComponent = iconTypes[type];

  const contentVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: position === "top" ? 10 : position === "bottom" ? -10 : 0,
      x: position === "left" ? 10 : position === "right" ? -10 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const iconVariants = {
    idle: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        duration: 0.1,
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const triggerElement = children || (
    <motion.button
      variants={iconVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      className={`
        inline-flex items-center justify-center rounded-full p-1
        text-gray-500 hover:text-blue-600 hover:bg-blue-50
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${iconClassName}
      `}
      data-testid={`animated-tooltip-${type}-icon`}
    >
      <IconComponent className="w-4 h-4" />
    </motion.button>
  );

  // Temporarily return simple fallback without tooltip functionality due to React hook violations
  return (
    <div className="relative inline-flex">
      {triggerElement}
      {/* Tooltip functionality temporarily disabled */}
    </div>
  );
}

// Animated action button component
interface LazyActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function LazyAnimatedActionButton({
  children,
  onClick,
  className = "",
  disabled = false
}: LazyActionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 
        text-white text-xs rounded-md transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      data-testid="animated-action-button"
    >
      {children}
    </motion.button>
  );
}

// Specialized tooltips with animation
export function LazyStatsHelpTooltip({ 
  content, 
  className = "",
  ...props 
}: Omit<LazyAnimatedTooltipProps, 'type'>) {
  return (
    <LazyAnimatedTooltip
      content={content}
      type="info"
      position="top"
      className={`bg-green-900 border-green-700 ${className}`}
      iconClassName="ml-1"
      maxWidth="max-w-sm"
      {...props}
      data-testid="animated-stats-help-tooltip"
    />
  );
}

export function LazyFeatureHelpTooltip({ 
  content, 
  className = "",
  ...props 
}: Omit<LazyAnimatedTooltipProps, 'type'>) {
  return (
    <LazyAnimatedTooltip
      content={content}
      type="question"
      position="bottom"
      className={`bg-purple-900 border-purple-700 ${className}`}
      maxWidth="max-w-md"
      {...props}
      data-testid="animated-feature-help-tooltip"
    />
  );
}

// Animated container for content
interface LazyAnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function LazyAnimatedContainer({
  children,
  className = "",
  delay = 0
}: LazyAnimatedContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        delay: delay / 1000, // Convert ms to seconds
        ease: "easeOut"
      }}
      className={className}
      data-testid="animated-container"
    >
      {children}
    </motion.div>
  );
}