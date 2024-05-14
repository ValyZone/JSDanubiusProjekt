import express from 'express'
import { errorHandler } from './dogs/error-handling.js'
import CreateDogsRouter from './dogs/router.js'
import CreateDiscordRouter from './discord/router.js'

export function CreateApp(dependencies) {
    const {saveDog, loadDogs, updateDog, removeDog, getDogByBreed, loadUsers, saveUser, updateUser, removeUser, getUserByName } = dependencies
    const breedsDependencies = { saveDog, loadDogs, updateDog, removeDog, getDogByBreed }
    const usersDependencies = { loadUsers, saveUser, updateUser, removeUser, getUserByName }

    const app = express()
    app.use(express.json())

    app.use(async (req, res, next) => {
        console.log("Method: " + req.method + ", Path: " + req.path)
        next()
    })

    app.use("/dogs", CreateDogsRouter(breedsDependencies))
    app.use("/discord", CreateDiscordRouter(usersDependencies))

    app.use(errorHandler)

    return app
}