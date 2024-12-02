const { getDB } = require('../db')
const { ObjectId } = require('mongodb')
async function getAllCategories() {
    try {
        const db = getDB();
        const collection = db.collection('categories')
        const categories = await collection.find().toArray()
        return categories
    } catch (error) {
        console.error("Error fetching all categories:", error);
        throw new Error("Failed to fetch categories")
    }
}

async function getCategoryWithProducts(id) {
    try {
        const db = getDB();

        const categoryWithProducts = await db.collection('categories').aggregate([
            { $match: { _id: ObjectId.createFromHexString(id) } }, 
            {
                $lookup: {
                    from: 'products',       
                    localField: '_id',    
                    foreignField: 'categoryId',
                    as: 'products'     
                }
            },
            {
                $project: {
                    name: 1,              
                    description: 1,          
                    products: 1              
                }
            }
        ]).toArray();

        if (categoryWithProducts.length === 0) {
            throw new Error("Category not found");
        }

        return categoryWithProducts
    } catch (error) {
        console.error(`Error fetching category with products by ID "${id}":`, error);
        throw new Error("Failed to fetch category with products");
    }
}

async function createCategory(newCategoryData) {
    try {
        const db = getDB();
        const collection = db.collection('categories')
        const response = await collection.insertOne(newCategoryData)

        return response
    } catch (error) {
        console.error("Error creating category:", error)
        throw new Error("Failed to create category");
    }
}

async function updateCategory(id, updatedData) {
    try {
        const db = getDB()
        const collection = db.collection('categories')

        const result = await collection.updateOne(
            { _id: ObjectId.createFromHexString(id) },
            { $set: updatedData }
        )

        if (result.matchedCount === 0) {
            throw new Error("Category not found")
        }

        return { message: "Category updated successfully" }
    } catch (error) {
        console.error(`Error updating category by ID "${id}":`, error);
        throw new Error("Failed to update category")
    }
}

async function deleteCategory(id) {
    try {
        const db = getDB();
        const collection = db.collection('categories')

        if (!ObjectId.isValid(id)) {
            throw new Error("Invalid category ID")
        }

        const result = await collection.deleteOne({ _id: ObjectId.createFromHexString(id) })

        if (result.deletedCount === 0) {
            throw new Error("Category not found")
        }

        return { message: "Category deleted successfully" }
    } catch (error) {
        console.error(`Error deleting category by ID "${id}":`, error)
        throw new Error("Failed to delete category")
    }
}

module.exports = {
    getAllCategories,
    getCategoryWithProducts,
    createCategory,
    updateCategory,
    deleteCategory,
};
