import { Exclude } from 'class-transformer';
import { User } from 'src/auth/auth.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './tasks-status.enum';

@Entity()
export class TaskEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    @CreateDateColumn({ type: 'timestamptz' })
    createAt: Date;

    @ManyToOne((_type) => User, (user) => user.tasks, {
        eager: false,
        onDelete: 'CASCADE',
    })
    // Xoa field user khi get All Task, vi user co trong task nen khi get no
    // hien field user --> bao mat
    @Exclude({ toPlainOnly: true })
    user: User;
}
