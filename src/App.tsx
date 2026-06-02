import { useEffect, useMemo, useState } from "react"

import { QrDisplay } from "@/components/qr-display"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/** Format a Date as a `datetime-local` input value (local time, with seconds). */
function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  )
}

function NowTab() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-mono text-lg tabular-nums">{now.toLocaleString()}</p>
      <QrDisplay date={now} />
    </div>
  )
}

function CustomTab() {
  const [value, setValue] = useState(() => toLocalInputValue(new Date()))

  const date = useMemo(() => {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }, [value])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-xs space-y-2">
        <Label htmlFor="custom-time">Date &amp; time</Label>
        <Input
          id="custom-time"
          type="datetime-local"
          step={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      {date ? (
        <QrDisplay date={date} />
      ) : (
        <p className="text-sm text-destructive">Enter a valid date and time.</p>
      )}
    </div>
  )
}

export function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>QR Time Sync</CardTitle>
          <CardDescription>
            Scan with the controller to set its clock.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="now">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="now">Now</TabsTrigger>
              <TabsTrigger value="custom">Custom time</TabsTrigger>
            </TabsList>
            <TabsContent value="now" className="pt-6">
              <NowTab />
            </TabsContent>
            <TabsContent value="custom" className="pt-6">
              <CustomTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
