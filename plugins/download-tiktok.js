import axios from "axios"
import config from "../config.js"

export default async (conn, m, text, from) => {
  if (!text.startsWith(".tt ")) return
  let url = text.split(" ")[1]
  if (!url) return conn.sendMessage(from, { text: "Masukkan URL Tiktok!" })

  try {
    let res = await axios.get(`https://api.botcahx.eu.org/api/dl/tiktok?url=${url}&apikey=${config.apikey}`)
    await conn.sendMessage(from, { video: { url: res.data.result.video }, caption: "Berhasil ✓" })
  } catch (e) {
    await conn.sendMessage(from, { text: "❌ Gagal mengambil video" })
  }
}
