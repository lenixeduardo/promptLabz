import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  back?: string;
  right?: ReactNode;
}

export function AppPageHeader({ title, subtitle, back, right }: Props) {
  return (
    <div className="sticky top-0 z-10 border-b border-stroke-muted bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        {back && (
          <Link
            to={back}
            className="rounded-full p-1.5 text-forest transition-colors hover:bg-surface-success"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}
        <div className="flex-1">
          <h1 className="text-lg font-bold text-primary-dark">{title}</h1>
          {subtitle && (
            <p className="text-xs text-foreground-tertiary">{subtitle}</p>
          )}
        </div>
        {right}
      </div>
    </div>
  );
}
