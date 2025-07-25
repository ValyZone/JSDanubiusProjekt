import { MongoClient } from 'mongodb'

export async function connectToMongo(dbUrl){
    const client = new MongoClient(dbUrl)
    await client.connect()
    const db = client.db('Danubius')

    const usersCollection = db.collection('Users')
    const dogsCollection = db.collection('Breeds')

    await usersCollection.createIndex( {name: 1}, {unique: true} )
    await dogsCollection.createIndex( {breed: 1}, {unique: true} )

    return{
        //DOGS
        async loadDogs(){ 
            return dogsCollection.find({}).toArray()
        },
        saveDog: async (dog) => {
            await dogsCollection.insertOne(
            {
                breed : dog.breed,
                origin : dog.origin,
                description : dog.description
            })
        },
        updateDog: (dog) => {
            const { breed, origin, description } = dog
            console.log(breed, origin, description)
            dogsCollection.updateOne({breed},
                {
                    $set: {
                        origin,
                        description
                    },
                }
            )
        },
        removeDog: async (dog) => {
            await dogsCollection.deleteOne(dog)
        },
        getDogByBreed(breed){
            return dogsCollection.findOne({breed}, {projection: {_id: 0}})
        },


        //DISCORD

        //Ranks:
        //User
        //Developer

        async loadUsers(){ 
            return usersCollection.find({}).toArray()
        },
        saveUser: async (user) => {
            await usersCollection.insertOne(
            {
                name : user.name,
                permission : 'not registered',
                discordId : 'null'
            })
        },
        updateUser: (user) => {
            const { name, permission, discordId } = user
            usersCollection.updateOne({name},
                {
                    $set: {
                        permission,
                        discordId
                    },
                }
            )
        },
        removeUser: async (name) => {
            await usersCollection.deleteOne(name)
        },
        getUserByName(name){
            return usersCollection.findOne({name}, {projection: {_id: 0}})
        },
        async closeConnection() {
            await client.close();
        }
    }
}