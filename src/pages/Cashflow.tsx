import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errors";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type PaymentRow = Database["public"]["Tables"]["payments"]["Row"];
type ServiceUnitRow = Database["public"]["Tables"]["service_units"]["Row"];
type PaymentListItem = PaymentRow & { service_unit: ServiceUnitRow | null };

export default function Cashflow() {
  const [payments, setPayments] = useState<PaymentListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const { data, error } = await supabase
          .from("payments")
          .select("*, service_unit:service_units(*)")
          .order("payment_date", { ascending: false })
          .limit(50);

        if (error) throw error;
        setPayments((data || []) as PaymentListItem[]);
      } catch (error) {
        toast.error(getErrorMessage(error, "Gagal memuat data arus kas."));
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const summary = useMemo(() => {
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    const dp = payments.filter((p) => p.payment_type === "dp").reduce((sum, p) => sum + p.amount, 0);
    const full = payments.filter((p) => p.payment_type === "full").reduce((sum, p) => sum + p.amount, 0);
    return { total, dp, full, count: payments.length };
  }, [payments]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Arus Kas</h1>
          <p className="text-muted-foreground mt-1">Ringkasan pemasukan dari pembayaran service.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Transaksi</p><p className="text-2xl font-bold">{summary.count}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Pemasukan</p><p className="text-2xl font-bold">Rp {summary.total.toLocaleString("id-ID")}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">DP</p><p className="text-2xl font-bold">Rp {summary.dp.toLocaleString("id-ID")}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Pelunasan</p><p className="text-2xl font-bold">Rp {summary.full.toLocaleString("id-ID")}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? <p className="text-muted-foreground">Loading...</p> : payments.length === 0 ? <p className="text-muted-foreground">Belum ada pembayaran.</p> : payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between border rounded-xl p-3">
                <div>
                  <p className="font-medium">{payment.service_unit?.service_number || "-"}</p>
                  <p className="text-sm text-muted-foreground">{new Date(payment.payment_date).toLocaleString("id-ID")}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">{payment.payment_type}</Badge>
                  <p className="font-semibold">Rp {payment.amount.toLocaleString("id-ID")}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
