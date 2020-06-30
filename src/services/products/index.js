const express = require("express")
const productsRouter = express.Router()
const path = require("path")
const fs = require("fs")
const uniqid = require("uniqid")
const multer = require("multer")
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

//edit a product
//sol1
productsRouter.put("/:id", (req,res,next)=>{
    try{
    const products = getProducts()
    const product = products.find(prod =>prod.id===req.params.id)
    if(product){
        const position = products.indexOf(product)
        const productUpdated= {...product, ...req.body}
        products[position]= productUpdated
        fs.writeFileSync(productsFilePath,JSON.stringify(products))
        res.send(productUpdated)
    }else{
        const error = new Error(`product with id ${req.params.id}not found`)
        error.httpStatusCode = 404
        next(error)
    }

    }catch (error){
        next(error)
    }
    
})

//sol 2
router.put("/:id",  (req, res, next) => {
    const products =  getProducts()
    if (products.length > 0) {
        const specificProduct = products.filter(product => product.id === req.params.id)
        const productsWithoutSP = products.filter(product => product.id !== req.params.id)

        if (specificProduct.length > 0) {

            const editedProduct = {
                id: req.params.id,
                ...req.body,
                createdAt: specificProduct[0].createdAt,
                updatedAt: new Date()
            }
            productsWithoutSP.push(editedProduct)
            console.log(productsWithoutSP)
            await fs.writeJSON(productsPath, productsWithoutSP)
            res.status(200).send(editedProduct)
        } else {
            const err = new Error()
            err.message = "We dont have any product with that ID!"
            err.httpStatusCode = 404
            next(err)
        }

    } else {
        const err = new Error()
        err.message = "We dont have products yet!"
        err.httpStatusCode = 404
        next(err)
    }

})
// sol1
const upload = multer({})
productsRouter.post("/:id/upload", upload.single("prodPic"), (req,res,next)=>{
    try{
        const products = getProducts()
        const product = products.find(pdt => pdt.id === req.params.id)
        if (product){
            const fileDest = path.join(__dirname, "../../images", req.params.id + path.extname(req.file.originalname))
            fs.writeFileSync(fileDest, req.file.buffer)
            product.updatedAt = new Date()
            product.imageUrl= "/images/" + req.params.id + path.extname(req.file.originalname)
            fs.writeFileSync(productsFilePath, JSON.stringify(products))
            res.send(product)
        }else{
            const error = new Error(`product with id ${req.params.id} not found`)
            error.httpStatusCode = 404
            next(error)
        }
    }catch(error){
        next(error)
    }
})
 //sol2
 router.post("/:id/upload", upload.single("product"),  (req, res, next) => {

    await fs.writeFile(path.join(imagePath, `${req.params.id}.png`), req.file.buffer)
    const products = getProducts()
    const specificProduct = products.filter(product => product.id === req.params.id)
    const productsWithoutSP = products.filter(product => product.id !== req.params.id)

    if (specificProduct.length > 0) {
        const addProductPhoto = specificProduct[0]
        addProductPhoto.imageUrl = `http://127.0.0.1:${port}/img/products/${req.params.id}.png`

        productsWithoutSP.push(addProductPhoto)

        await fs.writeJSON(productsPath, productsWithoutSP)

        res.status(200).send(productsWithoutSP)
    } else {
        const err = new Error()
        err.message = "We dont have any product with that ID!"
        err.httpStatusCode = 404
        next(err)
    }

})
 

module.exports = productsRouter