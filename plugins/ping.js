export default async (conn, m, text, from) => {
  if (text === ".ping") {
    await conn.sendMessage(from, { text: "🏓 Pong!" })
  }
}
