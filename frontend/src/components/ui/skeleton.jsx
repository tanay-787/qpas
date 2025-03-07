import { cn } from "@/lib/utils"
// CHANGES: Changed from bg-primary/10 to bg-muted
function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props} />)
  );
}

export { Skeleton }
