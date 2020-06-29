// Error handlers
//catch not found errors
const notFoundHandler = (err,req,res,next) =>{
    if(err.httpStatusCode ===404){
        res.status(404).send("resource not found")
    }
    next(err)
}

// catch unauthorised errors
const unauthorizedHandler = (err,req,res,next) =>{
    if(err.httpStatusCode===401){
        res.status(401).send("unauthorized")
    }
    next(err)
}

// catch forbidden errors
const forbiddenHandler = (err,req,res,next)=>{
    if(err.httpStatusCode===403){
        res.status(403).send("operation forbidden")
    }
    next(err)
}

// catch all
const catchAllHandler = (err,req,res,next)=>{
    if(!res.headersSent){
        res.status(er.httpStatusCode || 500).send(err.message)
    }
}

module.exports = {
    notFoundHandler,
    unauthorizedHandler,
    forbiddenHandler,
    catchAllHandler
}