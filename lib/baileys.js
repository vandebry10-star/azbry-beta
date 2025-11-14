import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"
import pino from "pino"

export async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const conn = makeWASocket({
    printQRInTerminal: true,
    browser: ["Azbry-MD", "Chrome", "1.0"],
    auth: state,
    logger: pino({ level: "silent" })
  })

  conn.ev.on("creds.update", saveCreds)

  return conn
}
