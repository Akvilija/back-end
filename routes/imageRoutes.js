const express = require('express')
const fs = require('fs')
const path = require('path')

const router = express.Router()

router.get('/images', (req, res) => {
  const uploadPath = path.join(__dirname, '../uploads')

  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch images' });
    }

    const fileUrls = files.map((file) => `/uploads/${file}`)
    res.status(200).json(fileUrls)
  })
})

module.exports = router
