import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  actions,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4 h-[85px]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
