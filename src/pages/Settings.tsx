import { useRef, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, RotateCcw, ImagePlus } from "lucide-react";
import { useBranding } from "@/hooks/use-branding";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors";
import { Switch } from "@/components/ui/switch";

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const MAX_SIZE_MB = 3;

export default function Settings() {
  const { branding, updateBranding, resetBranding } = useBranding();
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const toDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Gagal membaca file logo"));
      reader.readAsDataURL(file);
    });

  const applyLogo = async (file: File) => {
    try {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Format logo harus PNG, JPG, WEBP, atau SVG");
        return;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`Ukuran logo maksimal ${MAX_SIZE_MB}MB`);
        return;
      }

      const logoDataUrl = await toDataUrl(file);
      updateBranding({ logoDataUrl });
      toast.success("Logo usaha berhasil diperbarui");
    } catch (error) {
      toast.error(getErrorMessage(error, "Upload logo gagal. Coba ulangi lagi."));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pengaturan Brand</h1>
          <p className="text-muted-foreground mt-1">Atur nama usaha dan logo agar siap dipakai client (drag & drop).</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Identitas Usaha</CardTitle>
            <CardDescription>Perubahan tersimpan otomatis di browser ini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Nama Usaha</Label>
              <Input
                id="business-name"
                value={branding.businessName}
                onChange={(e) => updateBranding({ businessName: e.target.value })}
                placeholder="Contoh: ServiceHub Pro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={branding.tagline}
                onChange={(e) => updateBranding({ tagline: e.target.value })}
                placeholder="Contoh: Solusi servis enterprise tercepat"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>White-label & Signature</CardTitle>
            <CardDescription>
              Kontrol apakah signature Aura ditampilkan ke client.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
              <div>
                <p className="font-medium">Tampilkan signature</p>
                <p className="text-sm text-muted-foreground">Contoh: “Dirajut oleh Aura”.</p>
              </div>
              <Switch
                checked={branding.showPoweredByAura}
                onCheckedChange={(checked) => updateBranding({ showPoweredByAura: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="powered-by-text">Teks Signature</Label>
              <Input
                id="powered-by-text"
                value={branding.poweredByText}
                onChange={(e) => updateBranding({ poweredByText: e.target.value })}
                placeholder="Dirajut oleh Aura"
                disabled={!branding.showPoweredByAura}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logo Usaha</CardTitle>
            <CardDescription>Upload via tombol atau drag-and-drop langsung ke area berikut.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={async (e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (!file) return;
                await applyLogo(file);
              }}
              className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                dragging ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className="w-20 h-20 mx-auto rounded-2xl border bg-card p-2 overflow-hidden mb-4">
                <img src={branding.logoDataUrl} alt={branding.businessName} className="w-full h-full object-contain" />
              </div>
              <p className="font-medium">Drag & drop logo di sini</p>
              <p className="text-sm text-muted-foreground mt-1">PNG/JPG/WEBP/SVG, max {MAX_SIZE_MB}MB</p>

              <div className="mt-4 flex items-center justify-center gap-2">
                <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Pilih File
                </Button>
                <Button type="button" variant="secondary" onClick={resetBranding}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Default
                </Button>
              </div>

              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onChange={async (e) => {
                  try {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    await applyLogo(file);
                  } finally {
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>

            <div className="rounded-xl bg-secondary p-3 text-sm text-muted-foreground">
              <Upload className="h-4 w-4 inline mr-2" />
              Tip: Setelah update brand, nama & logo otomatis terpakai di sidebar, halaman login, dan header dashboard.
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
