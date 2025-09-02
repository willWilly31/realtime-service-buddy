import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  CreditCard,
  Phone,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle
} from "lucide-react";

// Mock data - in real app this would come from your backend
const dashboardMetrics = {
  cashflow: {
    total: "Rp 45,250,000",
    change: "+12% dari bulan lalu",
    changeType: "positive" as const
  },
  unitsIn: {
    total: 23,
    change: "+3 hari ini",
    changeType: "positive" as const
  },
  unitsOut: {
    total: 18,
    change: "+5 hari ini", 
    changeType: "positive" as const
  },
  pendingPayment: {
    total: 8,
    change: "2 overdue",
    changeType: "negative" as const
  }
};

const recentUnits = [
  {
    id: "SRV001",
    customer: "Budi Santoso", 
    phone: "iPhone 13",
    issue: "LCD Pecah",
    technician: "Ahmad",
    status: "in-progress" as const,
    payment: "dp" as const,
    amount: "Rp 850,000"
  },
  {
    id: "SRV002",
    customer: "Siti Aminah",
    phone: "Samsung A54",
    issue: "Baterai Drop",
    technician: "Rizki", 
    status: "completed" as const,
    payment: "paid" as const,
    amount: "Rp 320,000"
  },
  {
    id: "SRV003",
    customer: "Joko Widodo",
    phone: "Oppo Reno 8",
    issue: "Speaker Rusak",
    technician: "Dedi",
    status: "pending" as const,
    payment: "unpaid" as const,
    amount: "Rp 180,000"
  },
  {
    id: "SRV004", 
    customer: "Maya Putri",
    phone: "Xiaomi 12",
    issue: "Charging Port",
    technician: "Ahmad",
    status: "in-progress" as const,
    payment: "paid" as const,
    amount: "Rp 150,000"
  }
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Monitoring real-time bisnis service HP Anda
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Cashflow"
            value={dashboardMetrics.cashflow.total}
            change={dashboardMetrics.cashflow.change}
            changeType={dashboardMetrics.cashflow.changeType}
            icon={CreditCard}
            description="Revenue bulan ini"
          />
          <MetricCard
            title="Unit Masuk"
            value={dashboardMetrics.unitsIn.total}
            change={dashboardMetrics.unitsIn.change}
            changeType={dashboardMetrics.unitsIn.changeType}
            icon={TrendingUp}
            description="Unit diterima untuk service"
          />
          <MetricCard
            title="Unit Selesai"
            value={dashboardMetrics.unitsOut.total}
            change={dashboardMetrics.unitsOut.change}
            changeType={dashboardMetrics.unitsOut.changeType}
            icon={CheckCircle}
            description="Unit telah diselesaikan"
          />
          <MetricCard
            title="Pending Payment"
            value={dashboardMetrics.pendingPayment.total}
            change={dashboardMetrics.pendingPayment.change}
            changeType={dashboardMetrics.pendingPayment.changeType}
            icon={Clock}
            description="Unit menunggu pembayaran"
          />
        </div>

        {/* Recent Units Table */}
        <Card>
          <CardHeader>
            <CardTitle>Unit Service Terbaru</CardTitle>
            <CardDescription>
              Real-time tracking unit yang sedang dikerjakan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Service</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Kerusakan</TableHead>
                  <TableHead>Teknisi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.id}</TableCell>
                    <TableCell>{unit.customer}</TableCell>
                    <TableCell>{unit.phone}</TableCell>
                    <TableCell>{unit.issue}</TableCell>
                    <TableCell>{unit.technician}</TableCell>
                    <TableCell>
                      <StatusBadge status={unit.status}>
                        {unit.status === "in-progress" ? "Dikerjakan" : 
                         unit.status === "completed" ? "Selesai" : "Pending"}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={unit.payment}>
                        {unit.payment === "paid" ? "Lunas" :
                         unit.payment === "dp" ? "DP" : "Belum Bayar"}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{unit.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Teknisi Aktif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Ahmad</span>
                  <span className="text-primary font-medium">2 unit</span>
                </div>
                <div className="flex justify-between">
                  <span>Rizki</span>
                  <span className="text-primary font-medium">1 unit</span>
                </div>
                <div className="flex justify-between">
                  <span>Dedi</span>
                  <span className="text-primary font-medium">1 unit</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>LCD iPhone 13</span>
                  <span className="text-destructive font-medium">Stock: 2</span>
                </div>
                <div className="flex justify-between">
                  <span>Baterai Samsung A54</span>
                  <span className="text-warning font-medium">Stock: 5</span>
                </div>
                <div className="flex justify-between">
                  <span>Charger Port Xiaomi</span>
                  <span className="text-success font-medium">Stock: 15</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}