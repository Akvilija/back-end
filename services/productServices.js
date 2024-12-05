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

        return result
    } catch (error) {
        console.error(`Error updating product by ID "${id}":`, error)
        throw new Error("Failed to update product")
    }
}

async function deleteProduct(id) {
    try {
        const db = getDB();
        const collection = db.collection('products');

        let objectId = null;
        if (ObjectId.isValid(id)) {
            objectId = ObjectId.createFromHexString(id);
        } else {
            console.warn("ID is not a valid ObjectId, treating as a string:", id);
        }

        const product = await collection.findOne({ $or: [{ _id: objectId }, { _id: id }] });
        if (!product) {
            throw new Error("Product not found in database");
        }

        const result = await collection.deleteOne({ $or: [{ _id: objectId }, { _id: id }] });
        console.log("Delete Result:", result);

        if (result.deletedCount === 0) {
            throw new Error("Failed to delete product");
        }

        return { message: "Product deleted successfully" };
    } catch (error) {
        console.error(`Error deleting product by ID "${id}":`, error.message);
        throw new Error("Failed to delete product");
    }
}

async function getProductsByCategoryId(categoryId) {
      try {
        const db = getDB();
        const subcategories = await db
          .collection('subcategories')
          .find({ categoryId: ObjectId.createFromHexString(categoryId) })
          .toArray();
    
        const subcategoryIds = subcategories.map((sub) => sub._id);
    
        if (subcategoryIds.length === 0) {
          console.log('No subcategories found for this category');
          return [];
        }
    
        const products = await db
          .collection('products')
          .find({ subcategoryId: { $in: subcategoryIds } })
          .toArray();

        return products;
      } catch (error) {
        console.error(`Error fetching products for category ID "${categoryId}":`, error.message);
        throw new Error('Failed to fetch products');
      }
}

async function getProductsBySubcategoryId(subcategoryId) {
    try {
        const db = getDB();
        const collection = db.collection('products');

        const objectId = ObjectId.isValid(subcategoryId)
            ? ObjectId.createFromHexString(subcategoryId)
            : null;

        if (!objectId) {
            throw new Error(`Invalid subcategory ID: "${subcategoryId}"`);
        }

        return await collection.find({ subcategoryId: objectId }).toArray();
    } catch (error) {
        console.error(`Error fetching products by subcategory ID "${subcategoryId}":`, error);
        throw new Error("Failed to fetch products by subcategory ID");
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategoryId, 
    getProductsBySubcategoryId, 
}