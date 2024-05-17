import { Client, IntentsBitField } from 'discord.js';
import { resolveCommand } from './messages.js'

export function startBot(dependencies){

    const discord = new Client({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent,
        ],
    });
    
    discord.login('MTIzODU2NzA0NzE0MzYyNDcxNA.G6zXWS.lmnEeQtW9pr7UiTscA6smpVDryh7Gs1QUAM3Fo');
    discord.on('ready', (c) => {
        console.log(`  [!] ${c.user.displayName} is Online!`);
    });

    discord.on('messageCreate', (message) => {
        const commands = [
            'reg',
            'updateuser',
            'removeuser',
            'createdog',
            'getdogs',
            'removedog',
            'help',
            'op'
        ]
        if(!message.author.bot){
            if (message.channel == '1239926064847786014'){ //danubot-commands

                if (message.content != '' && message.content[0] == '!'){
                    const params = message.content.split('!')[1].toLowerCase().split(' ') ? 
                            message.content.split('!')[1].toLowerCase().split(' ') : 
                            message.content.split('!')[1].toLowerCase()

                    if(commands.includes(params[0])){
                        message.author.globalName = message.author.globalName.toLowerCase()
                        resolveCommand(message, commands, dependencies)
                    }
                    else{
                        message.reply('Unknown command, type "!help".')
                    }
                }
                else {
                    message.delete()
                }
            }
        }
        
    });
    return discord
}
