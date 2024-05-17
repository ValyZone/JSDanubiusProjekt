import {describe, it, mock, before, after} from 'node:test'
import {strictEqual, rejects, doesNotReject} from 'node:assert'
import request from 'supertest'
import {CreateApp} from './../../src/app.js'
import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'



describe('loadDog', () => {
    it('Check /dogs returns with 200', async () => {
        const app = CreateApp({
            loadDogs: mock.fn(() => Promise.resolve([]))
        })

        const response = await request(app).get('/dogs')

        strictEqual(response.statusCode, 200)
    })
})


describe('saveDog', () => {
    before(async () => {
        mongoServer = new MongoMemoryServer();
        await mongoServer.start();
        const mongoUri = mongoServer.getUri();
        mongoClient = new MongoClient(mongoUri);
        await mongoClient.connect();
        db = mongoClient.db('test');
        collection = db.collection('dogs');
    });

    after(async () => {
        await mongoClient.close();
        await mongoServer.stop();
    })

    let mongoServer;
    let mongoClient;
    let db;
    let collection;

    

    it('Successful Addition of a new Dog', async () => {
        await mongoClient.db('test').collection('dogs').createIndex( {breed: 1}, {unique: true} )
        
        const app = CreateApp({
            loadDogs: () => { collection.find().toArray() },
            saveDog: async (dog) => {
                const { _id, ...dataWithoutId } = dog
                return await mongoClient.db('test').collection('dogs').insertOne(dataWithoutId)
            }
        })

        const testDog = {breed: "teszt", origin: "elek", description: "this is a description for this test dog"}

        const response = await request(app).post('/dogs').send(testDog)

        strictEqual(response.statusCode, 201);
        strictEqual(response.text, 'teszt created.');
    })

    it('Unsuccessful addition of a new Dog, duplicate', async () => {
        const db = await mongoClient.db('test').collection('dogs2')
        db.createIndex( {breed: 1}, {unique: true} )

        const testDog = {breed: "teszt", origin: "elek", description: "this is a description for this test dog"}

        const { _id, ...dataWithoutId } = testDog;
        await db.insertOne(dataWithoutId)

        const testDog2 = {breed: "teszt", origin: "elek2", description: "this shouldn't be added"}

        const app = CreateApp({
            loadDogs: () => { collection.find().toArray() },
            saveDog: async (dog) => {
                const { _id, ...dataWithoutId2 } = dog;
                
                return await db.insertOne(dataWithoutId2)
            }
        })

        const response = await request(app).post('/dogs').send(testDog2)

        strictEqual(response.statusCode, 409)
    })
})

