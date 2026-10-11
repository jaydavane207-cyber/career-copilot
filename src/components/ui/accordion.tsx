"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  expandedItems: string[];
  toggleItem: (id: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue>({
  expandedItems: [],
  toggleItem: () => {},
});

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  collapsible?: boolean;
}

export function Accordion({
  type = "single",
  defaultValue,
  className,
  children,
  ...props
}: AccordionProps) {
  const initialValues = React.useMemo(() => {
    if (!defaultValue) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  }, [defaultValue]);

  const [expandedItems, setExpandedItems] = React.useState<string[]>(initialValues);

  const toggleItem = React.useCallback(
    (id: string) => {
      setExpandedItems((prev) => {
        if (type === "single") {
          return prev.includes(id) ? [] : [id];
        }
        return prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      });
    },
    [type]
  );

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem }}>
      <div className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItemContext = React.createContext<{ value: string; isExpanded: boolean }>({
  value: "",
  isExpanded: false,
});

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, className, children, ...props }, ref) => {
    const { expandedItems } = React.useContext(AccordionContext);
    const isExpanded = expandedItems.includes(value);

    return (
      <AccordionItemContext.Provider value={{ value, isExpanded }}>
        <div
          ref={ref}
          className={cn(
            "rounded-lg border border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { toggleItem } = React.useContext(AccordionContext);
  const { value, isExpanded } = React.useContext(AccordionItemContext);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => toggleItem(value)}
      className={cn(
        "flex w-full items-center justify-between px-4 py-3.5 text-left font-medium text-slate-900 transition-all hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800/60",
        className
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 dark:text-slate-400",
          isExpanded && "rotate-180 text-blue-600 dark:text-blue-400"
        )}
      />
    </button>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isExpanded } = React.useContext(AccordionItemContext);

  if (!isExpanded) return null;

  return (
    <div
      ref={ref}
      className={cn("px-4 pb-4 pt-1 text-sm text-slate-600 dark:text-slate-300", className)}
      {...props}
    >
      {children}
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";
