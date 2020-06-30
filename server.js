const express = require("express")
const server = express()
const productsRouter = require("./src/services/products")
const {
    catchAllHandler,
    forbiddenHandler,
    unauthorizedHandler,
    notFoundHandler,
} = require ("./src/errorHandler")
const path = require("path")
const cors = require("cors")
server.use(express.json())
server.use(cors())
// make the content of the images folder available
// server.use("/images", express.static(pathh.join(__dirname, "images")))
server.use("/products", productsRouter)

// Error handlers
server.use(notFoundHandler)
server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(catchAllHandler)




    
   
    
  


const port = process.env.PORT || 3000
server.listen(port, ()=>{
    console.log("server is running on ", port)
})