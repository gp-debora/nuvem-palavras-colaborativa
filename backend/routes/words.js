import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Word from '../models/Word.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const words = await Word.find().sort({ frequency: -1 });
        res.json(words);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao procurar palavras.' });
    }
});

router.post('/', async (req, res) => {
    const { word } = req.body;
    if (!word || typeof word !== 'string') {
        return res.status(400).json({ error: 'Palavra inválida.' });
    }

    try {
        let existingWord = await Word.findOne({ text: word });
        if (existingWord) {
            existingWord.frequency += 1;
            await existingWord.save();
        } else {
            const newWord = new Word({ text: word, frequency: 1 });
            await newWord.save();
        }
        res.status(200).json({ message: 'Palavra adicionada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar palavra.' });
    }
});

export default router;