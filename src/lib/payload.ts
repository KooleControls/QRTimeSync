/**
 * Time-sync payload encoded into the QR code and read by the controller.
 *
 * Format: KC1|CC07<DDMMYYYYHHMMSS>|<CRC16>
 *   - KC1       protocol prefix
 *   - CC07      "set time" command
 *   - args      DD MM YYYY HH MM SS (local time, zero-padded)
 *   - CRC16     CRC-16/MODBUS over the ASCII bytes before the final '|',
 *               formatted as 4 uppercase hex digits
 */

export const PREFIX = "KC1"
export const COMMAND = "CC07"

/** CRC-16/MODBUS: poly 0x8005 (reflected 0xA001), init 0xFFFF, refin/refout, xorout 0x0000. */
export function crc16Modbus(bytes: Uint8Array): number {
  let crc = 0xffff
  for (const byte of bytes) {
    crc ^= byte
    for (let i = 0; i < 8; i++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xa001 : crc >>> 1
    }
  }
  return crc & 0xffff
}

function pad(value: number, length: number): string {
  return String(value).padStart(length, "0")
}

/** Encode a Date as the 14-digit DDMMYYYYHHMMSS argument string (local time). */
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
  const body = `${PREFIX}|${COMMAND}${formatTimeArgs(date)}`
  const crc = crc16Modbus(new TextEncoder().encode(body))
  const crcHex = crc.toString(16).toUpperCase().padStart(4, "0")
  return `${body}|${crcHex}`
}
