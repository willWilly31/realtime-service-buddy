import { useBranding } from "@/hooks/use-branding";

interface BrandIdentityProps {
  compact?: boolean;
}

export function BrandIdentity({ compact = false }: BrandIdentityProps) {
  const { branding } = useBranding();

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-card border border-border overflow-hidden">
        <img src={branding.logoDataUrl} alt={branding.businessName} className="w-full h-full object-cover" />
      </div>
      {!compact && (
        <div className="min-w-0">
          <h2 className="text-base font-bold truncate">{branding.businessName}</h2>
          <p className="text-xs text-muted-foreground truncate">{branding.tagline}</p>
        </div>
      )}
    </div>
  );
}
