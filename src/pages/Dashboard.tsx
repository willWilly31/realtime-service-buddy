import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { StoreHeader } from "@/components/dashboard/StoreHeader";
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

// Enhanced Mock data with more comprehensive dummy data
const dashboardMetrics = {
  cashflow: {
    total: "Rp 127,850,000",
    change: "+18% dari bulan lalu",
    changeType: "positive" as const
  },
  unitsIn: {
    total: 42,
    change: "+8 hari ini",
    changeType: "positive" as const
  },
  unitsOut: {
    total: 35,
    change: "+12 hari ini", 
    changeType: "positive" as const
  },
  pendingPayment: {
    total: 14,
    change: "3 overdue",
    changeType: "negative" as const
  }
};

const recentUnits = [
  {
    id: "SRV001",
    customer: "Budi Santoso", 
    phone: "iPhone 14 Pro Max",
    issue: "LCD OLED Pecah + Touch",
    technician: "Ahmad Kurniawan",
    status: "in-progress" as const,
    payment: "dp" as const,
    amount: "Rp 2,850,000",
    estimatedCompletion: "2 jam lagi"
  },
  {
    id: "SRV002",
    customer: "Siti Aminah",
    phone: "Samsung Galaxy S23 Ultra",
    issue: "Baterai Drop + Fast Charging",
    technician: "Rizki Pratama", 
    status: "completed" as const,
    payment: "paid" as const,
    amount: "Rp 1,320,000",
    estimatedCompletion: "Selesai"
  },
  {
    id: "SRV003",
    customer: "Joko Widodo",
    phone: "Oppo Reno 10 Pro",
    issue: "Speaker + Mikrofon Rusak",
    technician: "Dedi Firmansyah",
    status: "pending" as const,
    payment: "unpaid" as const,
    amount: "Rp 580,000",
    estimatedCompletion: "Menunggu konfirmasi"
  },
  {
    id: "SRV004", 
    customer: "Maya Putri",
    phone: "Xiaomi 13T Pro",
    issue: "Charging Port + Kabel Data",
    technician: "Ahmad Kurniawan",
    status: "in-progress" as const,
    payment: "paid" as const,
    amount: "Rp 350,000",
    estimatedCompletion: "1 hari"
  },
  {
    id: "SRV005",
    customer: "Andi Wijaya",
    phone: "iPhone 13 Mini",
    issue: "Kamera Belakang Blur",
    technician: "Rizki Pratama",
    status: "completed" as const,
    payment: "paid" as const,
    amount: "Rp 1,150,000",
    estimatedCompletion: "Selesai"
  },
  {
    id: "SRV006",
    customer: "Linda Sari",
    phone: "Vivo V27 Pro",
    issue: "Layar Berkedip + Touchscreen",
    technician: "Dedi Firmansyah",
    status: "in-progress" as const,
    payment: "dp" as const,
    amount: "Rp 980,000",
    estimatedCompletion: "3 jam lagi"
  },
  {
    id: "SRV007",
    customer: "Hendra Gunawan",
    phone: "Realme GT Neo 5",
    issue: "Motherboard Water Damage",
    technician: "Ahmad Kurniawan",
    status: "pending" as const,
    payment: "unpaid" as const,
    amount: "Rp 2,200,000",
    estimatedCompletion: "Menunggu persetujuan"
  },
  {
    id: "SRV008",
    customer: "Dewi Kartika",
    phone: "Google Pixel 7a",
    issue: "WiFi + Bluetooth Bermasalah",
    technician: "Rizki Pratama",
    status: "in-progress" as const,
    payment: "paid" as const,
    amount: "Rp 450,000",
    estimatedCompletion: "4 jam lagi"
  }
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Store Header with Logo and Address */}
        <StoreHeader />

        {/* Dashboard Header */}
        <div className="bg-gradient-card p-6 rounded-xl shadow-card elegant-border">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-muted-foreground mt-2">
            Monitoring real-time bisnis service HP & penjualan aksesoris terlengkap
          </p>
        </div>

        {/* Enhanced Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Cashflow"
            value={dashboardMetrics.cashflow.total}
            change={dashboardMetrics.cashflow.change}
            changeType={dashboardMetrics.cashflow.changeType}
            icon={CreditCard}
            description="Revenue bulan ini"
            className="shadow-elegant bg-gradient-card"
          />
          <MetricCard
            title="Unit Masuk"
            value={dashboardMetrics.unitsIn.total}
            change={dashboardMetrics.unitsIn.change}
            changeType={dashboardMetrics.unitsIn.changeType}
            icon={TrendingUp}
            description="Unit diterima untuk service"
            className="shadow-elegant bg-gradient-card"
          />
          <MetricCard
            title="Unit Selesai"
            value={dashboardMetrics.unitsOut.total}
            change={dashboardMetrics.unitsOut.change}
            changeType={dashboardMetrics.unitsOut.changeType}
            icon={CheckCircle}
            description="Unit telah diselesaikan"
            className="shadow-elegant bg-gradient-card"
          />
          <MetricCard
            title="Pending Payment"
            value={dashboardMetrics.pendingPayment.total}
            change={dashboardMetrics.pendingPayment.change}
            changeType={dashboardMetrics.pendingPayment.changeType}
            icon={Clock}
            description="Unit menunggu pembayaran"
            className="shadow-elegant bg-gradient-card"
          />
        </div>

        {/* Enhanced Recent Units Table */}
        <Card className="shadow-card elegant-border">
          <CardHeader className="bg-gradient-accent rounded-t-xl">
            <CardTitle className="text-xl flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Unit Service Terbaru
            </CardTitle>
            <CardDescription>
              Real-time tracking unit service & estimasi waktu penyelesaian
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="font-semibold">ID Service</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Device</TableHead>
                  <TableHead className="font-semibold">Kerusakan</TableHead>
                  <TableHead className="font-semibold">Teknisi</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Payment</TableHead>
                  <TableHead className="font-semibold">Estimasi</TableHead>
                  <TableHead className="text-right font-semibold">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUnits.map((unit) => (
                  <TableRow key={unit.id} className="hover:bg-muted/30 border-border/30">
                    <TableCell className="font-mono font-medium text-primary">{unit.id}</TableCell>
                    <TableCell className="font-medium">{unit.customer}</TableCell>
                    <TableCell className="text-muted-foreground">{unit.phone}</TableCell>
                    <TableCell>{unit.issue}</TableCell>
                    <TableCell className="text-accent">{unit.technician}</TableCell>
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
                    <TableCell className="text-sm text-muted-foreground">{unit.estimatedCompletion}</TableCell>
                    <TableCell className="text-right font-bold text-primary">{unit.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Enhanced Quick Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-card elegant-border">
            <CardHeader className="bg-gradient-accent rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Teknisi Aktif
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-muted/20 rounded-lg">
                  <div>
                    <span className="font-medium">Ahmad Kurniawan</span>
                    <p className="text-xs text-muted-foreground">Senior Technician</p>
                  </div>
                  <span className="text-primary font-bold">3 unit</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/20 rounded-lg">
                  <div>
                    <span className="font-medium">Rizki Pratama</span>
                    <p className="text-xs text-muted-foreground">Mid Technician</p>
                  </div>
                  <span className="text-primary font-bold">3 unit</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/20 rounded-lg">
                  <div>
                    <span className="font-medium">Dedi Firmansyah</span>
                    <p className="text-xs text-muted-foreground">Hardware Specialist</p>
                  </div>
                  <span className="text-primary font-bold">2 unit</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card elegant-border">
            <CardHeader className="bg-gradient-accent rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-warning" />
                Inventory Alert
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div>
                    <span className="font-medium">LCD iPhone 14 Pro Max</span>
                    <p className="text-xs text-muted-foreground">High Priority</p>
                  </div>
                  <span className="text-destructive font-bold">Stock: 1</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-warning/10 rounded-lg border border-warning/20">
                  <div>
                    <span className="font-medium">Baterai Samsung S23</span>
                    <p className="text-xs text-muted-foreground">Medium Priority</p>
                  </div>
                  <span className="text-warning font-bold">Stock: 4</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-success/10 rounded-lg border border-success/20">
                  <div>
                    <span className="font-medium">Charger Type-C</span>
                    <p className="text-xs text-muted-foreground">Good Stock</p>
                  </div>
                  <span className="text-success font-bold">Stock: 28</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card elegant-border">
            <CardHeader className="bg-gradient-accent rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-success" />
                Performa Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-success/10 rounded-lg">
                  <span className="font-medium">Target Harian</span>
                  <span className="text-success font-bold">85%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-primary/10 rounded-lg">
                  <span className="font-medium">Unit Selesai</span>
                  <span className="text-primary font-bold">12/15</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-accent/10 rounded-lg">
                  <span className="font-medium">Rata-rata Repair</span>
                  <span className="text-accent font-bold">3.2 jam</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/20 rounded-lg">
                  <span className="font-medium">Customer Rating</span>
                  <span className="text-warning font-bold">⭐ 4.8/5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}