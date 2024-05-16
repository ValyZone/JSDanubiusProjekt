import express from 'express'
import { errorHandler, DuplicateItem } from './dogs/error-handling.js'
import CreateDogsRouter from './dogs/router.js'
import CreateDiscordRouter from './discord/router.js'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
//import { DefaultWebSocketManagerOptions } from 'discord.js'

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

    // <-- DATABASES -->

    app.get('/databases', (req, res, next) => {
        res.render('databases')
    })

    // <-- DOGS -->

    app.get('/databases/dogs', (req, res, next) => {
        res.render('databases-dogs')
    })

    app.get('/databases/dogs/post', (req, res, next) => {
        res.render('databases-dogs-post')
    })

    app.post('/databases/dogs/post/form', async (req, res, next) => {
        try{
            let { breed, origin, description } = req.body
            breed = breed.toLowerCase()
            const newDog = { breed, origin, description }
            
            const exists = await getDogByBreed(breed)
            if (exists){
                res.render('databases-dogs-post-exists')
            }
            else{
                saveDog(newDog)
                res.render('databases-dogs-post-succesful')
            }
        } catch(err){
            next(err)
        }
    })

    app.get('/databases/dogs/get', (req, res, next) => {
        res.render('databases-dogs-get')
    })

    app.get('/databases/dogs/get/alldogs', async (req, res) => {
        const alldogs = await loadDogs()
        res.json(alldogs);
    })

    app.get('/databases/dogs/put', (req, res, next) => {
        res.render('databases-dogs-put')
    })

    app.put('/databases/dogs/put/newdog', async (req, res, next) => {
        const { breed, origin, description } = req.body
        const oldDog = await getDogByBreed(breed)

        console.log(origin == '' ? oldDog.origin : origin)
        const updatedDog = {
            breed: breed,
            origin: origin == '' ? oldDog.origin : origin,
            description: description == '' ? oldDog.description : description,
        }

        updateDog(updatedDog);
        res.sendStatus(204)
    })

    app.get('/databases/dogs/put/updated', (req, res, next) => {
        res.render('databases-dogs-put-updated')
    })

    app.get('/databases/dogs/delete', (req, res, next) => {
        res.render('databases-dogs-delete')
    })

    app.delete('/databases/dogs/delete/process', (req, res, next) => {
        const dogToDelete = req.body
        removeDog(dogToDelete)
        res.sendStatus(204)
    })

    app.get('/databases/dogs/delete/succesfull', (req, res, next) => {
        res.render('databases-dogs-delete-succesful')
    })

    // <-- USERS -->

    app.get('/databases/users', (req, res, next) => {
        res.render('databases-users')
    })

    app.get('/databases/users/reg', (req, res, next) => {
        res.render('databases-users-reg')
    })

    app.post('/databases/users/reg/form', async (req, res, next) => {
        const { name } = req.body

        const exists = await getUserByName(name.toLowerCase())
            if (exists){
                res.render('databases-users-reg-exists')
            }
            else{
                saveUser({ name : name.toLowerCase() })
                res.render('databases-users-reg-successful')
            }
    })

    // <-- DANUBOT -->

    app.get('/danubot', (req, res, next) => {
        res.render('danubot')
    })

    app.get('/danubot/announcement', (req, res, next) => {
        res.render('danubot-announcement')
    })

    app.get('/danubot/announcement/process', (req, res, next) => {
        res.redirect('/discord/sendMessage/web')
    })

    app.get('/danubot/announcement/successful', (req, res, next) => {
        res.render('danubot-announcement-successful')
    })

    //--
    app.use(async (req, res, next) => {
        console.log("Method: " + req.method + ", Path: " + req.path)
        next()
    })

    app.use("/dogs", CreateDogsRouter(breedsDependencies))
    app.use("/discord", CreateDiscordRouter(dependencies))

    app.use(errorHandler)

    return app
}