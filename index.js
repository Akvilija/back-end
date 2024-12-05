const express = require("express")
require("dotenv").config()
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require('path');

const { connectToDB } = require('./db')
const productRoutes = require('./routes/productRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const subCategoryRoutes = require('./routes/subCategoryRoutes')
const imageRoutes = require('./routes/imageRoutes')

const app = express()

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(productRoutes)
app.use(categoryRoutes)
app.use(subCategoryRoutes)
app.use(imageRoutes);

const port = process.env.PORT || 3000

connectToDB()
    .then(() => {
        app.listen(port, () => console.log(`Server is running at port ${port}.`))
    })
    .catch(error => console.error('Failed to connect:', error))