const express = require('express');
const {
    getAllCategories,
    getCategoryWithProducts,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../services/categoryServices');

const router = express.Router();

router.get('/categories', async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/categories/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const categoryWithProducts = await getCategoryWithProducts(id);
        return res.json(categoryWithProducts);
    } catch (error) {
        console.error(`Error fetching category with products by ID "${id}":`, error.message);
        return res.status(500).json({ error: error.message });
    }
});

router.post('/categories', async (req, res) => {
    const newCategoryData = req.body;
    try {
        const category = await createCategory(newCategoryData);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const result = await updateCategory(id, updatedData);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/categories/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await deleteCategory(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
