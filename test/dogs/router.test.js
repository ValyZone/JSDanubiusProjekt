import {describe, it, mock, before, after} from 'node:test'
import {strictEqual, rejects, doesNotReject, throws} from 'node:assert'
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
        await collection.createIndex( {breed: 1}, {unique: true} )
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
        const db = await mongoClient.db('test').collection('dogs')
        db.createIndex( {breed: 1}, {unique: true} )
        
        const app = CreateApp({
            loadDogs: () => { collection.find().toArray() },
            saveDog: async (dog) => {
                return await db.insertOne(dog)
            }
        })

        const testDog = {breed: "teszt", origin: "elek", description: "this is a description for this test dog"}

        const response = await request(app).post('/dogs').send(testDog)

        strictEqual(response.statusCode, 201);
        strictEqual(response.text, 'teszt created.');
    })

    it('Successful Addition of a new Dog without origin and description', async () => {
        const db = await mongoClient.db('test').collection('dogs2')
        db.createIndex( {breed: 1}, {unique: true} )
        
        const app = CreateApp({
            loadDogs: () => { collection.find().toArray() },
            saveDog: async (dog) => {
                return db.insertOne(dog)
            }
        })

        const testDog = {breed: "teszt"}

        const response = await request(app).post('/dogs').send(testDog)

        strictEqual(response.statusCode, 201);
        strictEqual(response.text, 'teszt created.');
    })

    it('Unsuccessful addition of a new Dog, duplicate', async () => {
        const db = await mongoClient.db('test').collection('dogs3')
        db.createIndex( {breed: 1}, {unique: true} )

        const testDog = {breed: "teszt", origin: "elek", description: "this is a description for this test dog"}
        await db.insertOne(testDog)

        const testDog2 = {breed: "teszt", origin: "elek2", description: "this shouldn't be added"}

        const app = CreateApp({
            loadDogs: () => { collection.find().toArray() },
            saveDog: async (dog) => {                
                return await db.insertOne(dog)
            }
        })

        const response = await request(app).post('/dogs').send(testDog2)

        strictEqual(response.statusCode, 409)
    })
})

