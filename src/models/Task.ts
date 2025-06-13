import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("tasks")
export class Task {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column({ type: "varchar", length: 255 })
    title: string | undefined;

    @Column({ type: "text" })
    description: string | undefined;

    @Column({ type: "boolean", default: false })
    completed: boolean | undefined;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date | undefined;

    @ManyToOne(type => User, user => user.tasks)
    @JoinColumn({ name: "user_id" })
    user: User | undefined;
}