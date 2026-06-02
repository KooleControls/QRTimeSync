import { QRCodeSVG } from "qrcode.react"

import { buildPayload } from "@/lib/payload"

export function QrDisplay({ date }: { date: Date }) {
  const payload = buildPayload(date)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <QRCodeSVG
          value={payload}
          size={256}
          level="M"
          marginSize={0}
          className="h-64 w-64"
        />
      </div>
      <code className="max-w-full break-all text-center font-mono text-xs text-muted-foreground">
        {payload}
      </code>
    </div>
  )
}
