import express from 'express'
import { addDogZodSchema, updateDogZodSchema } from './schema.js'
import { parser } from './parser-middleware.js'

function CreateRouter(dependencies, discord){

const {saveDog, loadDogs, updateDog, removeDog, getDogByBreed} = dependencies
const dogsRouter = express.Router()

dogsRouter.get('', (req, res, next) => {
    const filter = req.query.content ? {
        content: req.query.content
    } : null
    const skip = req.query.skip ? parseInt(req.query.skip) : undefined
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined
    const sort = {}
    if (req.query.sortBy) {
        const [field, direction] = req.query.sortBy.split('_')
        sort[field] = direction === 'asc' ? 1 : -1
    }

    loadDogs({ filter, skip, limit, sort, breed: res.locals.breed }).then(dogs => {
        res.json(dogs)
    }).catch(next)
})

dogsRouter.get('/:breed', async (req, res, next) => {
    
    try{
        const dog = await getDogByBreed(req.params.breed)
        res.json(dog)
        
    } catch(err){
        next(err)
    }
})

dogsRouter.delete('/:breed', (req, res, next) => {
    removeDog({breed: req.params.breed, userId: res.locals.userId})
    .then(() => {
        res.status(200).send(req.params.breed +  " deleted.")
    })
    .catch(next)
})

dogsRouter.post('', parser(addDogZodSchema), async (req, res, next) => { 
    try {
        await saveDog({...res.locals.parsed})
        res.status(201).send(res.locals.parsed.breed + " created.")
    } catch (err) {
        next(err)
    }
})

dogsRouter.put('/:breed', parser(updateDogZodSchema), async (req, res, next) => {
    try {
        await updateDog({...res.locals.parsed, breed : req.params.breed})
        res.status(204).send(res.locals.parsed.breed + " updated.")
    } catch(err){
        next(err)
    }
    
})

return dogsRouter
}
export default CreateRouter

