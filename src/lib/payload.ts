/**
 * Time-sync payload encoded into the QR code and read by the controller.
 * Spec: KC1080 command barcodes (KBC-140).
 *
 * Format: KC1|<BODY>|<CRC16>
 *   - KC1       fixed prefix so the device knows it's a command, not a card
 *   - BODY      for time-sync = CC07 + timestamp as ddMMyyyyHHmmss
 *               (day, month, 4-digit year, hour, minute, second, 24h, local time)
 *   - CRC16     CRC-16/CCITT-FALSE over BODY only (poly 0x1021, init 0xFFFF),
 *               4 uppercase hex chars
 *
 * The reader appends CR automatically, so no terminator is needed in the QR.
 * The text must be encoded as-is (never base64), even in base64 reader mode.
 */

export const PREFIX = "KC1"
export const COMMAND = "CC07"

/** CRC-16/CCITT-FALSE: poly 0x1021, init 0xFFFF, no reflection, xorout 0x0000. */
export function crc16CcittFalse(bytes: Uint8Array): number {
  let crc = 0xffff
  for (const byte of bytes) {
    crc ^= byte << 8
    for (let i = 0; i < 8; i++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }
  return crc & 0xffff
}

function pad(value: number, length: number): string {
  return String(value).padStart(length, "0")
}

/** Encode a Date as the 14-digit ddMMyyyyHHmmss timestamp string (local time). */
export function formatTimeArgs(date: Date): string {
  return (
    pad(date.getDate(), 2) +
    pad(date.getMonth() + 1, 2) +
    pad(date.getFullYear(), 4) +
    pad(date.getHours(), 2) +
    pad(date.getMinutes(), 2) +
    pad(date.getSeconds(), 2)
  )
}

/** Build the full QR payload string for the given time. */
export function buildPayload(date: Date): string {
  const body = `${COMMAND}${formatTimeArgs(date)}`
  const crc = crc16CcittFalse(new TextEncoder().encode(body))
  const crcHex = crc.toString(16).toUpperCase().padStart(4, "0")
  return `${PREFIX}|${body}|${crcHex}`
}
