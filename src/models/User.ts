// src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Task } from "./Task";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "varchar", length: 255, unique: true })
  username: string | undefined;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @OneToMany(() => Task, task => task.user)
  tasks: Task[] | undefined;
}
