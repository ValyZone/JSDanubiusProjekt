

export async function resolveCommand(message, dependencies){
    const { loadUsers, saveUser, updateUser, removeUser, getUserByName } = dependencies;
    const params = message.content.split('!')[1].toLowerCase().split(' ') ? message.content.split('!')[1].toLowerCase().split(' ') : message.content.split('!')[1].toLowerCase() //undefined kivédés
    const user = await getUserByName(message.author.globalName) ? await getUserByName(message.author.globalName) : await getUserByName(message.author.discordId)

    switch (params[0]){
        case 'reg':
            //kezeld a bugokat
            if (user) {
                if(user.discordId != 'null') {
                    message.reply("User with same username already exists!")
                }
                else {
                    const newUser = user
                    newUser.discordId = message.author.id
                    updateUser(newUser)
                    message.reply("User registered.")
                }
            }
            else{
                message.reply("Please register on webapp first with your discord username.")
            }
            break;
        case 'update':
            const permissionsList = [
                {permissionName : 'user', roleId : '1239885429717729280'},
                {permissionName : 'developer', roleId : '1239884884210745454'}
            ]
            if (user) {
                if (user.permission == 'developer'){
                    if (permissionsList.map(x => x.permissionName).includes(params[2])) //valid permission
                    {
                        const affectedUser = await getUserByName(params[1])
                        if(affectedUser){
                            const affectedUserDiscord = await message.guild.members.fetch(affectedUser.discordId)
                            
                            affectedUserDiscord.roles.remove(permissionsList.find(x => x.permissionName == affectedUser.permission).roleId)
                            affectedUserDiscord.roles.add(permissionsList.find(x => x.permissionName == params[2]).roleId)

                            affectedUser.permission = params[2]
                            updateUser(affectedUser)

                            message.reply(`Permissions and role updated for "${params[2]}."`)
                        }
                        else{
                            message.reply(`User with the name "${params[2]} does not exist."`)
                        }
                        
                    }
                }
                else
                {

                    message.reply("You don't have permission to change this user's permissions.")
                }
            }
            else{
                message.reply("Please register on webapp first with your discord username.")
            }
            break;
        case 'delete':
            break;
        case 'help':
            break;
        default:
            return `${params[0]} is not a valid command.`
    }

    
}
