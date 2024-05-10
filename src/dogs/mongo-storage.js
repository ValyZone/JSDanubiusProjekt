import { MongoClient } from 'mongodb'

export async function connectToMongo(dbUrl){
    const dogsCollection = new MongoClient(dbUrl)
    .db('Danubius')
    .collection('Breeds')

    await dogsCollection.createIndex({breed: 1}, {unique: true})
    return{
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
        removeDog: async (breed) => {
            await dogsCollection.deleteOne(breed)
        },
        getDogByBreed(breed){
            return dogsCollection.findOne({breed}, {projection: {_id: 0}})
        }
    }
}