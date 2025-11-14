import { startBot } from "./lib/baileys.js"
import { Btn } from "./lib/buttons.js"
import fs from "fs"

async function AzbryStart() {
  const conn = await startBot()

  conn.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0]
    if (!m.message || m.key.fromMe) return

    let text = m.message.conversation || ""
    let from = m.key.remoteJid

    // load plugins
    const files = fs.readdirSync("./plugins").filter(f => f.endsWith(".js"))
    for (let f of files) {
      const plugin = await import(`./plugins/${f}`)
      plugin.default(conn, m, text, from)
    }
  })
}

AzbryStart()
