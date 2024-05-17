

export async function resolveCommand(message, commands, dependencies){
    const { loadUsers, saveUser, updateUser, removeUser, getUserByName, getDogByBreed, loadDogs, saveDog, removeDog } = dependencies;
    const params = message.content.split('!')[1].toLowerCase().split(' ') ? message.content.split('!')[1].toLowerCase().split(' ') : message.content.split('!')[1].toLowerCase() //undefined kivédés
    const user = await getUserByName(message.author.globalName) ? await getUserByName(message.author.globalName) : await getUserByName(message.author.discordId)

    switch (params[0]){
        case 'op':
            if (user){
                const newUser = user
                newUser.discordId = message.author.id
                newUser.permission = "developer"
                updateUser(newUser)

                const userToUpdate = await message.guild.members.fetch(newUser.discordId)
                userToUpdate.roles.add('1239884884210745454')
                message.reply("Whooaaa, you got access to developer permmissions!")
            }
            else{
                message.reply("Please register on webapp first with your discord username.")
            }
            break;
        case 'reg':
            if (user) {
                if(user.discordId != 'null') {
                    message.reply("User with same username already exists!")
                }
                else {
                    const newUser = user
                    newUser.discordId = message.author.id
                    updateUser(newUser)

                    const userToUpdate = await message.guild.members.fetch(newUser.discordId)
                    userToUpdate.roles.add('1239885429717729280')
                    message.reply("User registered.")
                }
            }
            else{
                message.reply("Please register on webapp first with your discord username.")
            }
            break;
        case 'updateuser':
            const permissionsList = [
                {permissionName : 'user', roleId : '1239885429717729280'},
                {permissionName : 'developer', roleId : '1239884884210745454'}
            ]
            if (user) {
                if (user.permission == 'developer'){
                    if (params[1] != message.author.globalName.toLowerCase()){
                        if (permissionsList.map(x => x.permissionName).includes(params[2])) //valid permission
                        {
                            const affectedUser = await getUserByName(params[1])
                            if(affectedUser){
                                const affectedUserDiscord = await message.guild.members.fetch(affectedUser.discordId)

                                affectedUserDiscord.roles.remove(permissionsList.find(x => x.permissionName == affectedUser.permission).roleId)
                                affectedUserDiscord.roles.add(permissionsList.find(x => x.permissionName == params[2]).roleId)

                                affectedUser.permission = params[2]
                                updateUser(affectedUser)

                                message.reply(`Permissions and role updated for ${params[1]}.`)
                            } 
                            else { message.reply(`User with the name "${params[1]}" does not exist.`) }
                        }
                        else { message.reply(`There is no such permission as ${params[2]}.`)}
                    }
                    else { message.reply(`You can't update your rank.`)}
                    
                }
                else { message.reply("You don't have permission to change this user's permissions.") }
            }
            else { message.reply("Please register on webapp first with your discord username.") }
            break;
        case 'removeuser':
            if (user) {
                if (user.permission == 'developer'){
                    const affectedUser = await getUserByName(params[1])

                    if (affectedUser){
                        const affectedUserDiscord = await message.guild.members.fetch(affectedUser.discordId)

                        affectedUserDiscord.roles.remove('1239884884210745454')
                        affectedUserDiscord.roles.remove('1239885429717729280')

                        removeUser(affectedUser)
                        message.reply(`User '${params[1]}' has been removed.`)
                    }
                    else { message.reply(`User with the name '${params[1]}' doesn't exist.`) }
                }
                else { message.reply("You don't have permission to remove this user.") }
            }
            else { message.reply("Please register on webapp first with your discord username.") }
            break;
        case 'getdogs':
            if (user) {
                const dogs = await loadDogs()
                let idx = 1
                dogs.forEach(dog => message.client.channels.cache.get('1239926064847786014').send(
                `[${idx++}]------------------------------------------\n
                **Breed**: ${dog.breed}\n
                **Origin**: ${dog.origin}\n
                **Description**: ${dog.description}`
                ))
                message.client.channels.cache.get('1239926064847786014').send('---------------------------------------------')
            }
            else { message.reply("Please register on webapp first with your discord username.") }
            break;
        case 'removedog':
            if (user) {
                if (user.permission == 'developer'){
                    const affectedDog = await getDogByBreed(params[1])

                    if (affectedDog){
                        removeDog(affectedDog)
                        message.reply(`'${params[1]}' has been removed.`)
                    }
                    else { message.reply(`Dog with the breed '${params[1]}' doesn't exist.`) }
                }
                else { message.reply("You don't have permission to remove this dog.") }
            }
            else { message.reply("Please register on webapp first with your discord username.") }
            break;
        case 'createdog':
            if (user) {
                if (user.permission == 'developer'){
                    const oldDog = await getDogByBreed(params[1])

                    if (!oldDog){
                        let description = ""
                        let copyParams = params
                        const lastParams = copyParams.splice(3) //used only to slice up
                        lastParams.forEach(item => description += (item + ' '))
                        const newDog = {breed : params[1].toLowerCase(), origin : params[2], description : description}
                        saveDog(newDog)
                        message.reply(`'${params[1]}' has been created.`)
                    }
                    else { message.reply(`Dog with the breed '${params[1]}' doesn't exist.`) }
                }
                else { message.reply("You don't have permission to add new dog.") }
            }
            else { message.reply("Please register on webapp first with your discord username.") }
            break;
        case 'help':
            let toPrint = ""
            commands.map(x => toPrint += ('"!' + x + '", ') )
            message.reply(`Commands avaible: ${ toPrint.slice(0, -2) }.`)
            break;
        default:
            return `${params[0]} is not a valid command.`
    }
}
