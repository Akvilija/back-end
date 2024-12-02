const { getDB } = require('../db')
const { ObjectId } = require('mongodb')

async function getAllProducts() {
    try {
        const db = getDB();
        const collection = db.collection('products')
        const products = await collection.find().toArray()
        return products
    } catch (error) {
        console.error("Error fetching all products:", error)
        throw new Error("Failed to fetch products")
    }
}

async function getProductById(id) {
    try {
        const db = getDB()
        const collection = db.collection('products')

        const product = await collection.findOne({ _id: ObjectId.createFromHexString(id) })

        if (!product) {
            throw new Error("Product not found")
        }

        return product
    } catch (error) {
        console.error(`Error fetching product by ID "${id}":`, error)
        throw new Error("Failed to fetch product")
    }
}

async function createProduct(newProductData) {
    try {
        const db = getDB();
        const collection = db.collection('products')

        const response = await collection.insertOne(newProductData)
        return response
    } catch (error) {
        console.error("Error creating product:", error)
        throw new Error("Failed to create product")
    }
}

async function updateProduct(id, updatedData) {
    try {
        const db = getDB()
        const collection = db.collection('products')

        const result = await collection.updateOne(
            { _id: ObjectId.createFromHexString(id) },
            { $set: updatedData }
        )

        if (result.matchedCount === 0) {
            throw new Error("Product not found");
        }

        return { message: "Product updated successfully" }
    } catch (error) {
        console.error(`Error updating product by ID "${id}":`, error)
        throw new Error("Failed to update product")
    }
}

async function deleteProduct(id) {
    try {
        const db = getDB()
        const collection = db.collection('products')

        const result = await collection.deleteOne({ _id: ObjectId.createFromHexString(id) })

        if (result.deletedCount === 0) {
            throw new Error("Product not found")
        }

        return { message: "Product deleted successfully" };
    } catch (error) {
        console.error(`Error deleting product by ID "${id}":`, error)
        throw new Error("Failed to delete product")
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
}

