
const express = require('express');
const router = express.Router();
const Word = require('../models/Word'); 

// GET all words in the cloud
router.get('/', async (req, res) => {
    try {
        const words = await Word.find({});
        res.json(words);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch words' });
    }
});

// POST a new word to the cloud
router.post('/', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Word text is required' });
    }

    try {
        let word = await Word.findOne({ text });
        if (word) {
            word.frequency += 1;
            await word.save();
        } else {
            word = new Word({ text, frequency: 1 });
            await word.save();
        }

        res.status(201).json(word);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add word' });
    }
});

module.exports = router;
