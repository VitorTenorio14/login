import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Task } from '../models/Task';

const taskRepository = AppDataSource.getRepository(Task);

export const getAllTasks = async (req: Request, res: Response) => {
    const tasks = await taskRepository.find({
        where: { user: { id: (req as any).user.id } },
        order: { createdAt: 'DESC' }
    });
    res.json(tasks);
};

export const createTask = async (req: Request, res: Response) => {
    const task = taskRepository.create({
        ...req.body,
        user: { id: (req as any).user.id }
    });
    const results = await taskRepository.save(task);
    res.status(201).json(results);
};

export const toggleTaskCompletion = async (req: Request, res: Response) => {
    const task = await taskRepository.findOne({
        where: { 
            id: parseInt(req.params.id),
            user: { id: (req as any).user.id }
        }
    });
    
    if (task) {
        task.completed = !task.completed;
        const results = await taskRepository.save(task);
        res.json(results);
    } else {
        res.status(404).send('Task not found');
    }
};


export function getTaskById(arg0: string, getTaskById: any) {
    throw new Error('Function not implemented.');
}

export function updateTask(arg0: string, updateTask: any) {
    throw new Error('Function not implemented.');
}

export function deleteTask(arg0: string, deleteTask: any) {
    throw new Error('Function not implemented.');
}
// ... (mantenha as outras funções existentes, atualizando para incluir a verificação de usuário)