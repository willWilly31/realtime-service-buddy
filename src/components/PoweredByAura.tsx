import { useBranding } from "@/hooks/use-branding";

export function PoweredByAura({ className = "" }: { className?: string }) {
  const { branding } = useBranding();

  if (!branding.showPoweredByAura) return null;

  return (
    <p className={`text-xs text-muted-foreground ${className}`.trim()}>
      {branding.poweredByText || "Dirajut oleh Aura"}
    </p>
  );
}
