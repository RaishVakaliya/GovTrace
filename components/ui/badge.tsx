import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-600 text-white shadow hover:bg-blue-700",
        secondary:
          "border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200",
        destructive:
          "border-transparent bg-red-500 text-white shadow hover:bg-red-600",
        outline: "text-slate-900 border-slate-300 dark:text-slate-100 dark:border-slate-700",
        // Government Status Specific Badges
        submitted:
          "border-slate-300 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        accepted:
          "border-blue-300 bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
        review:
          "border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
        approved:
          "border-purple-300 bg-purple-50 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
        ready:
          "border-emerald-300 bg-emerald-50 text-emerald-900 font-bold dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
