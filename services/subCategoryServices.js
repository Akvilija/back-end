const { getDB } = require('../db');
const { ObjectId } = require('mongodb');

async function getSubcategoriesByCategoryId(categoryId) {
  try {
    const db = getDB();
    const subcategories = await db.collection('subcategories').find({ categoryId: ObjectId.createFromHexString(categoryId) }).toArray();

    return subcategories;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw new Error('Failed to fetch subcategories');
  }
}

const getSubcategoryById = async (id) => {
    const db = getDB();
    const subcategory = await db.collection('subcategories').findOne({ _id: ObjectId.createFromHexString(id) });
    return subcategory;
  };

async function getAllSubcategories(categoryId = null) {
    try {
      const db = getDB();
      const query = categoryId ? { categoryId: ObjectId.createFromHexString(categoryId) } : {};
      return await db.collection('subcategories').find(query).toArray();
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      throw new Error('Failed to fetch subcategories');
    }
  }

async function createSubcategory({ categoryId, name }) {
  try {
    const db = getDB()

    const subcategoryToInsert = {
        name,
        categoryId: ObjectId.createFromHexString(categoryId),
      };
      const result = await db.collection('subcategories').insertOne(subcategoryToInsert);
      return result
  } catch (error) {
    console.error('Error creating subcategory:', error);
    throw new Error('Failed to create subcategory');
  }
}

async function updateSubcategory(id, updatedData) {
  try {
    const db = getDB();
    const result = await db.collection('subcategories').updateOne(
      { _id: ObjectId.createFromHexString(id) },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      throw new Error('Subcategory not found');
    }

    return { message: 'Subcategory updated successfully' };
  } catch (error) {
    console.error('Error updating subcategory:', error);
    throw new Error('Failed to update subcategory');
  }
}

async function deleteSubcategory(id) {
  try {
    const db = getDB();
    const result = await db.collection('subcategories').deleteOne({ _id: ObjectId.createFromHexString(id) });

    if (result.deletedCount === 0) {
      throw new Error('Subcategory not found');
    }

    return { message: 'Subcategory deleted successfully' };
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    throw new Error('Failed to delete subcategory');
  }
}

module.exports = {
  getSubcategoriesByCategoryId,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getAllSubcategories,
  getSubcategoryById
};
