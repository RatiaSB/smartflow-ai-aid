import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Check, Smartphone } from "lucide-react";
import logo from "@/assets/logo.png";

export function SidebarQR() {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setUrl(window.location.origin);
  }, []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mx-3 mt-4 rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-2">
        <Smartphone className="h-3 w-3" />
        Open on mobile
      </div>
      <div className="rounded-xl bg-white p-2 ring-1 ring-border flex items-center justify-center">
        {url ? (
          <QRCodeCanvas
            value={url}
            size={148}
            level="H"
            marginSize={1}
            bgColor="#ffffff"
            fgColor="#0b1220"
            imageSettings={{ src: logo, height: 30, width: 30, excavate: true }}
          />
        ) : (
          <div className="h-[148px] w-[148px] animate-pulse rounded-md bg-muted" />
        )}
      </div>
      <button
        onClick={onCopy}
        disabled={!url}
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg gradient-brand px-2 py-1.5 text-[11px] font-medium text-primary-foreground shadow-sm hover:opacity-95 transition disabled:opacity-50"
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied ? "Link copied" : "Copy link"}
      </button>
      <div className="mt-1.5 truncate text-center text-[10px] text-muted-foreground" title={url}>
        {url || "Loading…"}
      </div>
    </div>
  );
}
