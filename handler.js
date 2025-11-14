// handler.js
// Simple command handler untuk Baileys @whiskeysockets
// Plugin format: module.exports = { command, help, tags, owner, run(ctx) }

const fs = require('fs')
const path = require('path')

// prefix yang dipakai
const PREFIXES = ['.', '!', '#', '/']

function getTextFromMessage(m) {
  const msg = m.message || {}
  if (msg.conversation) return msg.conversation
  if (msg.extendedTextMessage?.text) return msg.extendedTextMessage.text
  if (msg.imageMessage?.caption) return msg.imageMessage.caption
  if (msg.videoMessage?.caption) return msg.videoMessage.caption
  return ''
}

function loadPlugins() {
  const dir = path.join(__dirname, 'plugins')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'))
  const plugins = []

  for (const file of files) {
    try {
      const mod = require(path.join(dir, file))
      if (mod && (mod.command || mod.run)) {
        plugins.push(mod)
        console.log('[plugin] loaded:', file)
      }
    } catch (e) {
      console.error('[plugin] gagal load', file, e.message)
    }
  }
  return plugins
}

const plugins = loadPlugins()

async function handleMessage(conn, m) {
  const body = getTextFromMessage(m)
  if (!body) return

  // cari prefix
  const prefix = PREFIXES.find(p => body.startsWith(p))
  if (!prefix) return

  const without = body.slice(prefix.length).trim()
  if (!without) return

  const [rawCmd, ...args] = without.split(/\s+/)
  const command = rawCmd.toLowerCase()
  const text = args.join(' ')

  const from = m.key.remoteJid
  const isGroup = from.endsWith('@g.us')
  const sender = m.key.participant || m.key.remoteJid

  const ctx = {
    conn,
    m,
    from,
    sender,
    isGroup,
    prefix,
    command,
    args,
    text,
    body
  }

  for (const plugin of plugins) {
    try {
      let match = false

      if (plugin.command instanceof RegExp) {
        match = plugin.command.test(command)
      } else if (Array.isArray(plugin.command)) {
        match = plugin.command.map(c => c.toLowerCase()).includes(command)
      } else if (typeof plugin.command === 'string') {
        match = plugin.command.toLowerCase() === command
      }

      if (!match) continue

      // cek owner
      if (plugin.owner) {
        const no = sender.split('@')[0]
        const owners = global.owner || []
        if (!owners.includes(no)) {
          await conn.sendMessage(from, { text: '❌ Fitur ini khusus owner.' }, { quoted: m })
          return
        }
      }

      // jalanin plugin
      if (typeof plugin.run === 'function') {
        await plugin.run(ctx)
        return
      }
    } catch (e) {
      console.error('[handler] error di plugin', plugin.command, e)
      try {
        await conn.sendMessage(from, { text: '⚠️ Terjadi error saat menjalankan perintah.' }, { quoted: m })
      } catch {}
      return
    }
  }
}

module.exports = { handleMessage }
