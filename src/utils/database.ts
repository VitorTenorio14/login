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
    schema: "public", 
    synchronize: true,
    logging: false,
    entities: [Task, User],
    subscribers: [],
    migrations: [],
});