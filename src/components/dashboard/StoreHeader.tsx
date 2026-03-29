import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock } from "lucide-react";
import { useBranding } from "@/hooks/use-branding";

export function StoreHeader() {
  const { branding } = useBranding();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {/* Logo and Store Info */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-card border border-border p-2">
            <img src={branding.logoDataUrl} alt={branding.businessName} className="w-full h-full object-contain" />
          </div>
          
          {/* Store Details */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">{branding.businessName}</h1>
            <p className="text-muted-foreground text-sm">{branding.tagline}</p>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground pt-2">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Jl. Sudirman No. 123, Jakarta</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>+62 821-1234-5678</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>08:00 - 20:00 WIB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <Badge className="bg-success text-success-foreground px-4 py-2">
          <div className="w-2 h-2 bg-success-foreground rounded-full mr-2 animate-pulse"></div>
          BUKA
        </Badge>
      </div>
    </div>
  );
}
