const express = require('express');
const {
  getSubcategoriesByCategoryId,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getAllSubcategories,
  getSubcategoryById
} = require('../services/subCategoryServices');

const router = express.Router();

router.get('/subcategories', async (req, res) => {
  const { categoryId } = req.query; 
  try {
    const subcategories = categoryId
      ? await getSubcategoriesByCategoryId(categoryId)
      : await getAllSubcategories();
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/subcategories/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const subcategory = await getSubcategoryById(id); 
      if (!subcategory) {
        return res.status(404).json({ error: 'Subcategory not found' });
      }
      res.status(200).json(subcategory);
    } catch (error) {
      console.error('Error fetching subcategory by ID:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

router.post('/subcategories', async (req, res) => {
  const { categoryId, name } = req.body; 

  try {
    const newSubcategory = await createSubcategory({ categoryId, name });
    res.status(201).json(newSubcategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/subcategories/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const result = await updateSubcategory(id, updatedData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/subcategories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteSubcategory(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
