import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className={cn("h-8 w-8 animate-spin text-primary", className)} />
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex h-full min-h-[50vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
