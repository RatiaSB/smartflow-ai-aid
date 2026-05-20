import { cn } from "@/lib/utils";

export function PageHeader({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-4", className)}>
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl gradient-brand text-primary-foreground shadow-sm shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
