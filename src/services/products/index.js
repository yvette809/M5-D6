const express = require("express")
const productsRouter = express.Router()
const path = require("path")
const fs = require("fs")
const { profileEnd } = require("console")

const productsFilePath = path.join(__dirname, "products.json")
const getProducts = () =>{
    const productFileContent= fs.readFileSync(productsFilePath)
    const productsContent = productFileContent.toString()
    const products = JSON.parse(productsContent)
    console.log("product is",products)
    return products
    
}

//1. Get products
productsRouter.get("/", (req,res,next) =>{
    try{
        const products = getProducts()
    if(req.query.category){
       const filterPdt = products.filter(pdt => pdt.category=== req.query.category)
       res.send(filterPdt)
        
    }else{
        res.send(products)
    }
    } catch(error){
        console.log(error)
        const err = new Error("While getting products list a problem occured")
        next()
    }      
})

//get a specific pdt


module.exports = productsRouter