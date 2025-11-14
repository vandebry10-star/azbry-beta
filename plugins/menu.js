import { Btn } from "../lib/buttons.js"

export default async (conn, m, text, from) => {
  if (text !== ".menu") return

  const menu = Btn
    .setBody("✨ *AZBRY-MD REBORN*\nPilihan menu:")
    .addButton("Ping", ".ping")
    .addButton("Tiktok DL", ".tt <url>")
    .addButton("Owner", ".owner")
    .toJSON()

  await conn.sendMessage(from, menu)
}
