import { createContext, useContext, useEffect, useMemo, useState } from "react";
import defaultLogo from "@/assets/dm-repair-logo.png";

export interface BrandingConfig {
  businessName: string;
  tagline: string;
  logoDataUrl: string;
}

const STORAGE_KEY = "service_buddy_branding_v1";

const DEFAULT_BRANDING: BrandingConfig = {
  businessName: "DM Repair",
  tagline: "Solution for your smartphone",
  logoDataUrl: defaultLogo,
};

interface BrandingContextValue {
  branding: BrandingConfig;
  updateBranding: (next: Partial<BrandingConfig>) => void;
  resetBranding: () => void;
}

const BrandingContext = createContext<BrandingContextValue | null>(null);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<BrandingConfig>(DEFAULT_BRANDING);

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) return;

    try {
      const parsed = JSON.parse(cached) as BrandingConfig;
      setBranding({ ...DEFAULT_BRANDING, ...parsed });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo<BrandingContextValue>(() => ({
    branding,
    updateBranding: (next) => {
      setBranding((prev) => {
        const merged = { ...prev, ...next };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      });
    },
    resetBranding: () => {
      setBranding(DEFAULT_BRANDING);
      localStorage.removeItem(STORAGE_KEY);
    },
  }), [branding]);

  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error("useBranding must be used within BrandingProvider");
  }
  return context;
}
