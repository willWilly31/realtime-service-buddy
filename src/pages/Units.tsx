import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Phone, User, AlertCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors";

type ServiceUnitRow = Database["public"]["Tables"]["service_units"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type CustomerRow = Database["public"]["Tables"]["customers"]["Row"];
type ServiceUnitListItem = ServiceUnitRow & {
  customer: CustomerRow | null;
  technician: ProfileRow | null;
};

export default function Units() {
  const [units, setUnits] = useState<ServiceUnitListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUnits();
    
    // Realtime subscription
    const channel = supabase
      .channel('service-units-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_units'
        },
        () => {
          loadUnits();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadUnits = async () => {
    try {
      const { data, error } = await supabase
        .from('service_units')
        .select(`
          *,
          customer:customers(*),
          technician:profiles(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUnits((data || []) as ServiceUnitListItem[]);
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memuat data unit service."));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-warning/20 text-warning border-warning/50',
      'in-progress': 'bg-accent/20 text-accent border-accent/50',
      'waiting-parts': 'bg-muted/20 text-muted-foreground border-muted',
      'completed': 'bg-success/20 text-success border-success/50',
      'cancelled': 'bg-destructive/20 text-destructive border-destructive/50',
      'customer-confirmed': 'bg-primary/20 text-primary border-primary/50'
    };
    return colors[status] || 'bg-muted';
  };

  const filteredUnits = useMemo(() => units.filter(unit =>
    unit.service_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.model?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [units, searchTerm]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Unit Service</h1>
            <p className="text-muted-foreground mt-1">Kelola semua unit yang masuk</p>
          </div>
          <Button className="rounded-xl shadow-elegant hover:shadow-glow transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Unit Baru
          </Button>
        </div>

        {/* Search & Filter */}
        <Card className="border-border shadow-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nomor service, customer, brand..."
                  className="pl-10 bg-background rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-xl">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Units Grid */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-24 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUnits.map((unit) => (
              <Card
                key={unit.id}
                className="border-border hover:shadow-elegant transition-all cursor-pointer group rounded-2xl overflow-hidden"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {unit.service_number}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{unit.brand} {unit.model}</span>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(unit.status)} rounded-full border`}>
                      {unit.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-foreground font-medium">{unit.customer?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-3 w-3" />
                    <span className="line-clamp-1">{unit.issue_description}</span>
                  </div>
                  {unit.estimated_cost && (
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Estimasi</span>
                        <span className="text-sm font-bold text-primary">
                          Rp {unit.estimated_cost.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredUnits.length === 0 && (
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Belum ada unit</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Tidak ada hasil yang cocok' : 'Mulai dengan menambahkan unit baru'}
              </p>
              {!searchTerm && (
                <Button className="rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Unit Pertama
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
