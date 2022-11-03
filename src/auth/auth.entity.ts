import { TaskEntity } from 'src/tasks/tasks.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ default: false })
    admin: boolean;

    @Column({ default: null })
    refreshtoken: string;

    // eager: true, chi duoc mot phia, phia con lai ko dc set. No dung de fetch data field
    // co eager trong cau truy van find cua QueryBuilder
    // vd: { username: a, tasks: [{...}, {...}, ...]}
    @OneToMany((_type) => TaskEntity, (tasks) => tasks.user, {
        eager: true,
    })
    tasks: [];
}
