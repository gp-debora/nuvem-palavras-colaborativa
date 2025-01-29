import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import wordRoutes from './routes/words.js';
import http from 'http';
import { Server } from 'socket.io';
import { authenticateToken } from './middleware/auth.js';


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/words', wordRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('Utilizador conectado');

    socket.on('new-word', (word) => {
        io.emit('update-cloud', word);
    });

    socket.on('disconnect', () => {
        console.log('Utilizador desconectado');
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🔥 Servidor a correr na porta ${PORT}`));
