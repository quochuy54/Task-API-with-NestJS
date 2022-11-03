import { EntityRepository, Repository } from 'typeorm';
import { TaskStatus } from './tasks-status.enum';
import { SearchFilterTask } from './dto/searchFilterTask.dto';
import { TaskEntity } from './tasks.entity';
import { createTaskDto } from './dto/createTast.dto';
import { User } from 'src/auth/auth.entity';

@EntityRepository(TaskEntity)
export class TasksRepository extends Repository<TaskEntity> {
    async getTasks(
        searchFilterTask: SearchFilterTask,
        user: User,
    ): Promise<TaskEntity[]> {
        const { status, search } = searchFilterTask;
        const query = this.createQueryBuilder('task');
        query.where({ user: user });

        if (searchFilterTask.status) {
            query.andWhere('task.status = :status', {
                status: status,
            });
        }

        if (search) {
            query.andWhere(
                // Can than where + ...AND...OR... => ...AND...(...OR...)
                '(LOWER(task.name) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${search}%` },
            );
        }
        const tasks = await query.getMany();
        return tasks;
        // return this.find();
    }

    async createTask(taskDTO: createTaskDto, user: User): Promise<TaskEntity> {
        const task = this.create({
            name: taskDTO.name,
            description: taskDTO.description,
            status: TaskStatus.OPEN,
            user: user,
        });
        return await this.save(task);
        // return task;
    }
}
