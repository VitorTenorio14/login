import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './config/database';
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
import cors from 'cors';
import { createInitialData } from './utils/seeds';
import path from 'path';

dotenv.config();

async function startServer() {
    try {
        // Inicializa a conexão com o banco de dados
        await AppDataSource.initialize();
        console.log('Database connected successfully');

        // Cria dados iniciais (usuário admin)
        await createInitialData();

        const app = express();
        const PORT = process.env.PORT || 3000;

        // Middlewares
        app.use(cors());
        app.use(express.json());

        // Serve arquivos estáticos (HTML, CSS, JS) da pasta views
        app.use(express.static(path.join(__dirname, 'views')));

        // Rota para carregar index.html diretamente
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'views', 'index.html'));
        });

        // Rotas da API
        app.use('/api/auth', authRoutes);
        app.use('/api/tasks', taskRoutes);

        // Health check
        app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'API funcionando',
                endpoints: {
                    auth: '/api/auth',
                    tasks: '/api/tasks'
                }
            });
        });

        // Middleware de tratamento de erro
        app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error(err.stack);
            res.status(500).json({ message: 'Internal Server Error' });
        });

        // Inicia o servidor
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
