import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validação simples
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    // Hash da password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo utilizador
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Guardar no MongoDB
    await newUser.save();

    res.status(201).json({ message: 'Utilizador registado com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao registar utilizador:', error);
    res.status(500).json({ error: 'Erro ao registar utilizador.' });
  }
};
