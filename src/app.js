import express from 'express'
import { errorHandler } from './dogs/error-handling.js'
import CreateRouter from './dogs/router.js'
import { Client, IntentsBitField } from 'discord.js'



export function CreateApp(dependencies) {
    const app = express()
    const discord = new Client({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent,
        ],
    })

    app.use(express.json())
    discord.login('MTIzODU2NzA0NzE0MzYyNDcxNA.G6zXWS.lmnEeQtW9pr7UiTscA6smpVDryh7Gs1QUAM3Fo')
    discord.on('ready', (c) => {
        console.log(`  [!] ${c.user.displayName} is Online!`)
    })

    // app.use((req, res, next) => {
    //     console.log('helo')
    //     next()
    // })

    app.use(myMiddleware)

    async function myMiddleware(req, res, next) {
        console.log("Method: " + req.method + ", Path: " + req.path)
        next()
    }

    app.use("/dogs", CreateRouter(dependencies, discord))

    app.use(errorHandler)

    return app
}