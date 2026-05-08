import Link from "next/link";
import { Building2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Building2 className="h-12 w-12 text-primary mb-4" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-muted-foreground mb-6">Page not found</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
