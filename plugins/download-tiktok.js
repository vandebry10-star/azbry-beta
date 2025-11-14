// plugins/tiktok.js
// Download video TikTok pakai Botcahx API

const axios = require("axios")

module.exports = {
  command: ['tiktok', 'tt', 'ttdl'],
  help: ['tiktok <url>', 'tt <url>'],
  tags: ['downloader'],

  async run({ conn, m, from, args }) {
    let url = args[0]
    if (!url) return m.reply(`❗ Masukkan URL TikTok\nContoh: .tt https://vt.tiktok.com/...`)

    try {
      const APIKEY = global.botcahx // pastikan sudah ada di config.js

      let res = await axios.get(
        `https://api.botcahx.eu.org/api/dowloader/tiktok?url=${encodeURIComponent(url)}&apikey=${APIKEY}`
      )

      if (!res.data || !res.data.result?.video) {
        return m.reply("⚠️ Gagal mengambil video TikTok.")
      }

      let video = res.data.result.video

      await conn.sendMessage(
        from,
        {
          video: { url: video },
          caption: "🎬 *Berhasil download TikTok!*"
        },
        { quoted: m }
      )
    } catch (e) {
      console.log(e)
      return m.reply("❌ Terjadi kesalahan mengambil video TikTok.")
    }
  }
}
