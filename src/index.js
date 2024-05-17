import { CreateApp } from "./app.js"
import { connectToMongo } from './common/mongo-storage.js'
import CreateDiscordRouter from './discord/router.js'


process.on('unhandledRejection', (reason, promise) => {
    console.log('ALERT ALERT ALERT (Graceful shutdown..): ', reason)
    //...
    process.exit(1)
})

const db = await connectToMongo('mongodb://localhost:27017')
const app = CreateApp(db)

app.listen(3000, () => {
    console.log('App is running 🚀')
})