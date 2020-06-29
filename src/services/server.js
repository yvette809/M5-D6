const express = require("express")
const server = express()
const path = require("path")
const listEndPoints = require("express-list-endpoints")
const productsRouter = require("./services/products")

server.use(express.json())
server.use(cors())

const port = process.env.PORT || 3000
server.listen(port, ()=>{
    console.log("server is running on ", port)
})
