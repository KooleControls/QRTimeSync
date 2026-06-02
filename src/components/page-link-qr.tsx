import { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"

/**
 * Small QR linking to this page's own URL, so a PC user can scan it and open
 * the app on their phone. Hidden on small/touch screens where it's pointless.
 */
export function PageLinkQr() {
  const [url, setUrl] = useState("")

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  if (!url) return null

  return (
    <div className="mt-6 hidden flex-col items-center gap-2 md:flex">
      <div className="rounded-lg bg-white p-2 shadow-sm">
        <QRCodeSVG value={url} size={88} level="M" marginSize={0} />
      </div>
      <p className="text-xs text-muted-foreground">Scan to open on your phone</p>
    </div>
  )
}
