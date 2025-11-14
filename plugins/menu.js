// plugins/menu.js
// Menu utama (otomatis baca semua plugin)

const fs = require("fs")
const path = require("path")

module.exports = {
  command: ['menu', 'help'],
  help: ['menu'],
  tags: ['main'],

  async run({ conn, from, m, prefix }) {
    let plugins = global.plugins || {}
    let categories = {}

    // kelompokkan plugin per tag
    for (let filename in plugins) {
      let pl = plugins[filename]
      let tag = pl.tags?.[0] || 'others'
      if (!categories[tag]) categories[tag] = []
      categories[tag].push(pl)
    }

    // bangun teks menu
    let txt = `🌐 *Menu Bot*  
Hai @${m.sender.split("@")[0]}

Silakan pilih perintah:
──────────────────────\n`

    for (let tag in categories) {
      txt += `\n📂 *${tag.toUpperCase()}*\n`
      for (let pl of categories[tag]) {
        if (!pl.help) continue
        for (let h of pl.help) {
          txt += `• ${prefix}${h}\n`
        }
      }
    }

    await conn.sendMessage(
      from,
      {
        text: txt,
        mentions: [m.sender]
      },
      { quoted: m }
    )
  }
}
