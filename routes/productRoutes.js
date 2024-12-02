const express = require('express')
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../services/productServices')

const router = express.Router()

router.get('/products', async (req, res) => {
    try {
        const products = await getAllProducts()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get('/products/:id', async (req, res) => {
    const { id } = req.params
    try {
        const product = await getProductById(id)
        res.status(200).json(product)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
})

router.post('/products', async (req, res) => {
    const newProductData = req.body
    try {
        const product = await createProduct(newProductData)
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.put('/products/:id', async (req, res) => {
    const { id } = req.params
    const updatedData = req.body

    try {
        const result = await updateProduct(id, updatedData)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

router.delete('/products/:id', async (req, res) => {
    const { id } = req.params

    try {
        const result = await deleteProduct(id)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router