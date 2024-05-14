//import {} from 'messages.js'
import express from 'express'
import { sendDiscordMessageZodSchema } from '../common/schema.js'
import { parser } from '../common/parser-middleware.js'
import { Client, IntentsBitField } from 'discord.js'

function CreateDiscordRouter(dependencies){
    //DISCORD SIDE
    const discord = new Client({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent,
        ],
    })
    
    discord.login('MTIzODU2NzA0NzE0MzYyNDcxNA.G6zXWS.lmnEeQtW9pr7UiTscA6smpVDryh7Gs1QUAM3Fo')
    discord.on('ready', (c) => {
        console.log(`  [!] ${c.user.displayName} is Online!`)
    })

    discord.on('messageCreate', (message) => {
        
    })

    //REQUESTS SIDE
    const usersRouter = express.Router()
    const { loadUsers, saveUser, updateUser, removeUser, getUserByName } = dependencies

    usersRouter.post('/sendMessage', parser(sendDiscordMessageZodSchema), async (req, res, next) => { 
        try {
            channel.send(res.locals.parsed.message);
            res.status(201).send("Message sent.")
        } catch (err) {
            next(err)
        }
    })

    return usersRouter
}

export default CreateDiscordRouter