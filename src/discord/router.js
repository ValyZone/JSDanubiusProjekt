import express from 'express';
import { sendDiscordMessageZodSchema } from '../common/schema.js';
import { parser } from '../common/parser-middleware.js';
import {startBot} from './bot.js'
import { addUserZodSchema, updateUserZodSchema } from '../common/schema.js'

function CreateDiscordRouter(dependencies) {
    const client = startBot(dependencies);

    const usersRouter = express.Router();
    const { loadUsers, saveUser, updateUser, removeUser, getUserByName } = dependencies;

    usersRouter.post('/sendMessage', parser(sendDiscordMessageZodSchema), async (req, res, next) => {
        try {
            client.channels.cache.get('1239923748988260372').send(res.locals.parsed.message)
            res.status(201).send("Message sent.");
        } catch (err) {
            next(err);
        }
    });

    usersRouter.get('/:name', async (req, res, next) => {
        try{
            const user = await getUserByName(req.params.name)
            res.json(user)
            
        } catch(err){
            next(err)
        }
    })

    usersRouter.post('', parser(addUserZodSchema), async (req, res, next) => { 
        try {
            await saveUser({...res.locals.parsed})
            res.status(201).send(res.locals.parsed.name + " created.")
        } catch (err) {
            next(err)
        }
    })

    usersRouter.put('/:name', parser(updateUserZodSchema), async (req, res, next) => {
        try {
            await updateUser({...res.locals.parsed, name : req.params.name})
            res.status(204).send(res.locals.parsed.name + " updated.")
        } catch(err){
            next(err)
        }
    })

    return usersRouter;
}


export default CreateDiscordRouter