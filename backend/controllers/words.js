export const addWord = async (req, res, io) => {
  try {
    const { text } = req.body;

    // Verificar se a palavra já existe
    const word = await Word.findOneAndUpdate(
      { text },
      { $inc: { frequency: 1 } },
      { new: true, upsert: true }
    );

    // Garantir que `frequency` está presente
    const response = {
      text: word.text,
      frequency: word.frequency,
    };

    // Debug para garantir que o backend está a enviar corretamente
    console.log('Emissão WebSocket:', response);

    // Enviar a resposta para o frontend via WebSocket
    io.emit('updateCloud', response);

    // Enviar resposta ao cliente que fez a requisição
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar palavra.' });
  }
};
