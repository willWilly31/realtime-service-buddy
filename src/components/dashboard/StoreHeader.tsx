import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Globe } from "lucide-react";

export function StoreHeader() {
  return (
    <Card className="mb-6 shadow-card elegant-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Logo and Store Info */}
          <div className="flex items-center space-x-6">
            {/* Logo Placeholder */}
            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-2xl font-bold text-primary-foreground">SH</span>
            </div>
            
            {/* Store Details */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">ServiceHub Pro</h1>
              <p className="text-muted-foreground text-sm">Pusat Service & Aksesoris HP Terpercaya</p>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>Jl. Sudirman No. 123, Jakarta Pusat</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>+62 821-1234-5678</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Operating Hours */}
          <div className="text-right space-y-2">
            <div className="flex items-center justify-end space-x-2">
              <Badge variant="secondary" className="bg-success text-success-foreground">
                <div className="w-2 h-2 bg-success-foreground rounded-full mr-1"></div>
                BUKA
              </Badge>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>08:00 - 20:00 WIB</span>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>www.servicehub.co.id</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}