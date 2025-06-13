import { DataSource } from "typeorm";
import { Task } from "../models/Task";
import { User } from "../models/User";
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,  // Altere para false em produção
    logging: true,
    entities: [Task, User],
    migrations: [],
    subscribers: [],
    extra: {
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    }
});