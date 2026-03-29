import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errors";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type InventoryRow = Database["public"]["Tables"]["inventory"]["Row"];

export default function Inventory() {
  const [items, setItems] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const { data, error } = await supabase
          .from("inventory")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(100);

        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        toast.error(getErrorMessage(error, "Gagal memuat inventory."));
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  const lowStockCount = useMemo(
    () => items.filter((item) => item.quantity <= (item.min_stock ?? 0)).length,
    [items]
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Inventori</h1>
          <p className="text-muted-foreground mt-1">Kontrol stok sparepart dan harga satuan.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Item</p><p className="text-2xl font-bold">{items.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Stok Rendah</p><p className="text-2xl font-bold text-warning">{lowStockCount}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Nilai Estimasi Stok</p><p className="text-2xl font-bold">Rp {items.reduce((n, i) => n + i.quantity * i.unit_price, 0).toLocaleString("id-ID")}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Daftar Sparepart</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {loading ? <p className="text-muted-foreground">Loading...</p> : items.length === 0 ? <p className="text-muted-foreground">Belum ada data inventory.</p> : items.map((item) => {
              const isLow = item.quantity <= (item.min_stock ?? 0);
              return (
                <div key={item.id} className="flex items-center justify-between border rounded-xl p-3">
                  <div>
                    <p className="font-medium">{item.part_name}</p>
                    <p className="text-sm text-muted-foreground">{item.category} • {item.brand || "-"} {item.model || ""}</p>
                  </div>
                  <div className="text-right">
                    {isLow ? <Badge className="mb-1 bg-warning/20 text-warning">Low Stock</Badge> : <Badge variant="secondary" className="mb-1">Aman</Badge>}
                    <p className="font-semibold">{item.quantity} pcs</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
