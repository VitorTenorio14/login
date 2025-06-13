import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

export const createInitialData = async () => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        
        const adminExists = await userRepository.findOne({ where: { username: 'admin' } });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = userRepository.create({
                username: 'admin',
                password: hashedPassword
            });
            await userRepository.save(admin);
            console.log('Admin user created successfully');
        }
    } catch (error) {
        console.error('Error creating initial data:', error);
        throw error;
    }
};