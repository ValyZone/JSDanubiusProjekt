export function errorHandler(err, req, res, next){
    console.log('There is an error: ', err)
    const code = mapErrorToStatusCode(err)
    res.status(code).send(err.message)
}

function mapErrorToStatusCode(err){
    if(err.name == 'NotFoundError'){
        return 404;
    }
    else if(err.code === 11000){
        return 409
    }
    else{
        return 500
    }
}