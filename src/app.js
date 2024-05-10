import express from 'express'
import { errorHandler } from './dogs/error-handling.js'
import CreateRouter from './dogs/router.js'

export function CreateApp(dependencies) {
    const app = express()

    app.use(express.json())

    // app.use((req, res, next) => {
    //     console.log('helo')
    //     next()
    // })

    app.use(myMiddleware)

    async function myMiddleware(req, res, next) {
        console.log("Method: " + req.method + ", Path: " + req.path)
        next()
    }

    app.use("/dogs", CreateRouter(dependencies))

    app.use(errorHandler)

    return app
}