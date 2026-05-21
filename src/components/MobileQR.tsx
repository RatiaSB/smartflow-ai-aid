import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Smartphone, Copy, Check } from "lucide-react";
import logo from "@/assets/logo.png";

export function MobileQR({ url }: { url?: string }) {
  const [resolvedUrl, setResolvedUrl] = useState(url ?? "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!url && typeof window !== "undefined") {
      setResolvedUrl(window.location.origin);
    }
  }, [url]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
      <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full gradient-brand opacity-10 blur-3xl" />
      <div className="relative grid gap-6 md:gap-8 md:grid-cols-[auto_1fr] items-center">
        {/* QR card */}
        <div className="mx-auto md:mx-0">
          <div className="relative rounded-2xl bg-white p-4 shadow-card ring-1 ring-border">
            <div className="relative">
              {resolvedUrl ? (
                <QRCodeCanvas
                  value={resolvedUrl}
                  size={208}
                  level="H"
                  marginSize={1}
                  bgColor="#ffffff"
                  fgColor="#0b1220"
                  imageSettings={{
                    src: logo,
                    height: 44,
                    width: 44,
                    excavate: true,
                  }}
                />
              ) : (
                <div className="h-[208px] w-[208px] animate-pulse rounded-md bg-muted" />
              )}
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
              <Smartphone className="h-3 w-3" />
              Scan to open
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 backdrop-blur px-3 py-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-muted-foreground">Take it with you</span>
          </div>
          <h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
            Use SmartOffice AI on your phone
          </h3>
          <p className="mt-2 max-w-md mx-auto md:mx-0 text-sm text-muted-foreground">
            Scan the QR code with your phone camera to instantly open the assistant on
            mobile — perfect for the reception desk, the shop floor, or on the go.
          </p>

          <div className="mt-4 inline-flex w-full max-w-md items-center gap-2 rounded-xl border border-border bg-background p-1.5 pl-3">
            <span className="truncate text-sm text-muted-foreground flex-1 text-left">
              {resolvedUrl || "Loading…"}
            </span>
            <button
              onClick={onCopy}
              disabled={!resolvedUrl}
              className="inline-flex items-center gap-1.5 rounded-lg gradient-brand px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:opacity-95 transition disabled:opacity-50"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
