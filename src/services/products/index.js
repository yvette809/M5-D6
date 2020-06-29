const express = require("express")
const productsRouter = express.Router()
const path = require("path")
const fs = require("fs-extra")

const productsFilePath = path.join(__dirname, "products.json")
const getProducts = () =>{
    const productFileContent= fs.readFileSync(productsFilePath).toString()
    const products = JSON.parse(productFileContent)
    console.log(products)
}


module.exports = productsRouter