import express from 'express'
import { errorHandler, DuplicateItem } from './dogs/error-handling.js'
import CreateDogsRouter from './dogs/router.js'
import CreateDiscordRouter from './discord/router.js'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import { DefaultWebSocketManagerOptions } from 'discord.js'

export function CreateApp(dependencies) {
    const {saveDog, loadDogs, updateDog, removeDog, getDogByBreed, loadUsers, saveUser, updateUser, removeUser, getUserByName } = dependencies
    const breedsDependencies = { saveDog, loadDogs, updateDog, removeDog, getDogByBreed }
    const usersDependencies = { loadUsers, saveUser, updateUser, removeUser, getUserByName }

    const app = express()
    app.use(express.json())
    app.use(express.urlencoded())
    const __dirname = dirname(fileURLToPath(import.meta.url))
    app.set('views', join(__dirname, '../views'))
    app.set('view engine', 'hjs')

    app.get('/', (req, res, next) => {
        res.render('index')
    })

    //DATABASES
    app.get('/databases', (req, res, next) => {
        res.render('databases')
    })

    app.get('/databases/dogs', (req, res, next) => {
        res.render('databases-dogs')
    })

    app.get('/databases/dogs/post', (req, res, next) => {
        res.render('databases-dogs-post')
    })

    app.post('/databases/dogs/post/form', async (req, res, next) => {
        try{
            const { breed, origin, description } = req.body
            const newDog = { breed, origin, description }
            
            const exists = await getDogByBreed(breed)
            if (exists){
                res.render('databases-dogs-post-exists')
            }
            else{
                saveDog(newDog)
                res.render('databases-dogs-post-succesfull')
            }

        } catch(err){
            next(err)
        }
    })

    app.get('/databases/dogs/get', (req, res, next) => {
        res.render('databases-dogs-get')
    })

    app.get('/databases/dogs/put', (req, res, next) => {
        res.render('databases-dogs-put')
    })

    app.get('/databases/dogs/delete', (req, res, next) => {
        res.render('databases-dogs-delete')
    })

    app.get('/databases/users', (req, res, next) => {
        res.render('databases-users')
    })

    app.use(async (req, res, next) => {
        console.log("Method: " + req.method + ", Path: " + req.path)
        next()
    })

    app.use("/dogs", CreateDogsRouter(breedsDependencies))
    app.use("/discord", CreateDiscordRouter(usersDependencies))

    app.use(errorHandler)

    return app
}