const express = require("express")
const productsRouter = express.Router()
const path = require("path")
const fs = require("fs")
const { profileEnd } = require("console")
const { check, sanitizeBody, validationResult } = require("express-validator")

const productsFilePath = path.join(__dirname, "products.json")
const getProducts = () =>{
    const productFileContent= fs.readFileSync(productsFilePath)
    const productsContent = productFileContent.toString()
    const products = JSON.parse(productsContent)
    console.log("product is",products)
    return products
    
}

const reviewsFilePath = path.join(__dirname, "../reviews/reviews.json")
const getReviews = () =>{
    const reviewsFileContent= fs.readFileSync(reviewsFilePath)
    const reviewsContent = reviewsFileContent.toString()
    const reviews = JSON.parse(reviewsContent)
    console.log("review is",reviews)
    return reviews
    
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
        const err = new Error
        error.httpStatusCode = 404
        next(err)
    }      
})

//get a specific pdt
productsRouter.get("/:id", (req,res,next)=>{
    try{
        const products = getProducts()
        const product = products.filter(pdt => pdt.id === req.params.id)
        if(product){
            res.send(product)
        }else{
            const error = new Error()
            error.httpStatusCode = 404
            next(error)
        }

    } catch(error){
       console.log(error)
       next("while getting products list a problem occured!")
    }
    
})

// get reviews for a specific product
productsRouter.get("/:id/reviews", (req,res,next)=>{
    try{
    const reviews = getReviews()
    const filteredReview = reviews.filter(review =>review.elementId === req.params.id)

    }catch(error){
        console.log(error)
        next("while getting reviews a problem occured!")
    }  
})

// create a new product
const validation = [
    check("name")
    .isLength({min:4})
    .withMessage("Name should have atleast 4 chars"),
    check("category").exists().withMessage("category is missing"),
    check("description")
    .isLength({min:50, max:1000})
    .withMessage("description must be between 50 and 1000 chars"),
    check("price").isNumeric().withMessage("must be a number"),
    sanitizeBody("price").toFloat()
]
productsRouter.post("/", validation, (req,res,next) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors)
        const error = new Error()
        error.httpStatusCode=400
        error.message = errors
        next(error)
    }else{
        try{
            const newProduct = {
                ...req.body,
                createdAt:new Date(),
                updatedAt: new Date(),
                id:uniqid()
            }
            const products = getProducts()
            products.push(newProduct)
            fs.writeFileSync(productsFilePath, JSON.stringify(products))
            res.send(newProduct)
        } catch(error){
            console.log(error)
            next(error)
        }
    }
})

// delete a single product
productsRouter.delete("/:id", (req,res,next)=>{
    try{
        const products = getProducts()
        const productFound = products.find(pdt => pdt.id ===req.params.id)
        if(!productFound){
            const error = new Error("product not found")
            error.httpStatusCode = 404
            next(error)
        }else{
            const filteredPdts = products.filter(pdt=> pdt.id !==req.params.id)
            fs.writeFileSync(productsFilePath, JSON.stringify(filteredPdts))
            res.send("deleted")
        }

    }catch(error){
        console.log(error)
        next(error)
    }
})

module.exports = productsRouter