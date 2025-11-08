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
      <StoreHeader />

      {/* Top Metrics - Resq.io Style */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div className="bg-card rounded-2xl p-6 border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Masalah Kritis</span>
              <div className="metric-badge bg-primary/20 text-primary">
                <span className="text-xs font-bold">12/9</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">38</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span>Critical issues</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Hari Dikerjakan</span>
              <div className="metric-badge bg-accent/20 text-accent">
                <span className="text-xs font-bold">24/9</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">26</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              <span>Days spent</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-warning/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Pekerjaan Mendesak</span>
              <div className="metric-badge bg-warning/20 text-warning">
                <span className="text-xs font-bold">30/9</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">103</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-warning animate-pulse"></div>
              <span>Overnight work</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Summary Card */}
        <div className="chart-card">
          <h3 className="font-semibold text-foreground mb-4">Ringkasan</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm text-foreground">Triage</span>
              </div>
              <span className="font-bold text-foreground">1234</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-muted"></div>
                <span className="text-sm text-foreground">Fixing</span>
              </div>
              <span className="font-bold text-foreground">0</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <span className="text-sm text-foreground">Investigating</span>
              </div>
              <span className="font-bold text-foreground">24</span>
            </div>
          </div>
        </div>

        {/* Statistics - Placeholder for chart */}
        <div className="chart-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Frekuensi Insiden</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs rounded-lg bg-secondary text-foreground">12 bulan</button>
              <button className="px-3 py-1 text-xs rounded-lg bg-muted text-muted-foreground">30 hari</button>
              <button className="px-3 py-1 text-xs rounded-lg bg-muted text-muted-foreground">1 minggu</button>
            </div>
          </div>
          <div className="h-48 flex items-center justify-center bg-secondary/50 rounded-lg border border-border">
            <p className="text-muted-foreground text-sm">Area Chart Placeholder</p>
          </div>
        </div>
      </div>

      {/* Active Incidents */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Unit Aktif</CardTitle>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs rounded-lg bg-secondary text-foreground">Terbaru</button>
                <button className="px-3 py-1 text-xs rounded-lg bg-muted text-muted-foreground">Semua</button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentUnits.slice(0, 3).map((unit) => (
              <div key={unit.id} className="p-4 bg-secondary rounded-xl border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <StatusBadge status={unit.status as any}>
                        {unit.status === 'in-progress' ? 'Investigating' : 'Fixing'}
                      </StatusBadge>
                      <span className="text-xs text-muted-foreground">{unit.id}</span>
                    </div>
                    <p className="text-sm text-foreground font-medium">{unit.issue}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{unit.estimatedCompletion}</span>
                </div>
                <div className="flex items-center space-x-2 mt-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground font-bold">
                    {unit.customer.charAt(0)}
                  </div>
                  <span className="text-xs text-muted-foreground">{unit.customer}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Statistics Donut */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Statistik</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-primary opacity-20"></div>
                  <div className="absolute inset-8 rounded-full bg-accent opacity-30"></div>
                  <div className="absolute inset-16 rounded-full bg-warning opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">64%</div>
                      <div className="text-xs text-muted-foreground">Investigating</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">64% Investigating</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <span className="text-muted-foreground">26% Triage</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <span className="text-muted-foreground">15% Fixing</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}