const express = require('express');
const fs = require('fs');
let router = express.Router()
const pino = require("pino");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore
} = require("@whiskeysockets/baileys");

function removeFile(FilePath){
    try{    if(!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true }) }catch(e){}
 };
router.get('/', async (req, res) => {
    let num = req.query.number;
    let dirs = './'+(num || `session`)
    await removeFile(dirs);
        async function Pair() {
        const {
            state,
            saveCreds
        } = await useMultiFileAuthState(dirs)
     try {
            let GlobalTechInc = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({level: "fatal"}).child({level: "fatal"})),
                },
                printQRInTerminal: false,
                logger: pino({level: "fatal"}).child({level: "fatal"}),
                browser: [ "Ubuntu", "Chrome", "20.0.04" ],
             });
             if(!GlobalTechInc.authState.creds.registered) {
                await delay(2000);
                        num = num.replace(/[^0-9]/g,'');
                            const code = await GlobalTechInc.requestPairingCode(num)
                 if(!res.headersSent){
                    console.log({ num, code})
                 await res.send({code});
                     }
                 }
            GlobalTechInc.ev.on('creds.update', saveCreds)
            GlobalTechInc.ev.on("connection.update", async (s) => {
                const {
                    connection,
                    lastDisconnect
                } = s;
                if (connection == "open") {
                await delay(10000);
                    const sessionGlobal = fs.readFileSync(dirs   + '/creds.json');
                    const audioglobal = fs.readFileSync('./ting.mp3');
                   // GlobalTechInc.groupAcceptInvite("Kjm8rnDFcpb04gQNSTbW2d");
				const globalses = await GlobalTechInc.sendMessage(GlobalTechInc.user.id, 
                    { 
                        document: sessionGlobal, 
                        mimetype: `application/json`, 
                        fileName: `creds.json` 
                    });

				GlobalTechInc.sendMessage(GlobalTechInc.user.id, {
                    audio: audioglobal,
                    mimetype: 'audio/mp4',
                    ptt: true
                }, {
                    quoted: globalses
                });
				await GlobalTechInc.sendMessage(GlobalTechInc.user.id, { text: `🛑Do not share this file with anybody\n\n© Subscribe @GlobalTechInfo on Youtube` }, {quoted: globalses});
        await delay(100);
        return await removeFile(dirs);
        // process.exit(0)
            } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    Pair();
                }
            });
        } catch (err) {
            console.log("service restated");
             await removeFile(dirs);
         if(!res.headersSent){
            await res.send({code:"Service Unavailable"});
         }
        }
    }
    return await Pair()
});

process.on('uncaughtException', function (err) {
let e = String(err)
if (e.includes("conflict")) return
if (e.includes("Socket connection timeout")) return
if (e.includes("not-authorized")) return
if (e.includes("rate-overlimit")) return
if (e.includes("Connection Closed")) return
if (e.includes("Timed Out")) return
if (e.includes("Value not found")) return
console.log('Caught exception: ', err)
})

module.exports = router
