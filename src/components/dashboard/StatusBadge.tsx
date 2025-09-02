import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "pending" | "in-progress" | "completed" | "paid" | "unpaid" | "dp";
  children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const statusStyles = {
    pending: "bg-warning text-warning-foreground",
    "in-progress": "bg-primary text-primary-foreground",
    completed: "bg-success text-success-foreground",
    paid: "bg-success text-success-foreground",
    unpaid: "bg-destructive text-destructive-foreground",
    dp: "bg-warning text-warning-foreground"
  };

  return (
    <Badge className={cn(statusStyles[status])}>
      {children}
    </Badge>
  );
}