// main.js
const makeWASocket = require('@whiskeysockets/baileys').default
const { useMultiFileAuthState } = require('@whiskeysockets/baileys')
const pino = require('pino')
const { handleMessage } = require('./handler')

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('./session')

  const conn = makeWASocket({
    printQRInTerminal: true,
    browser: ['Azbry-MD New', 'Chrome', '1.0'],
    auth: state,
    logger: pino({ level: 'silent' })
  })

  conn.ev.on('creds.update', saveCreds)

  conn.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m?.message) return
    if (m.key.fromMe) return
    await handleMessage(conn, m)
  })
}

start().catch(console.error)
