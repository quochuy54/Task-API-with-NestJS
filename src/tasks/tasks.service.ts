import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { v4 as uuid } from 'uuid';
import { createTaskDto } from './dto/createTast.dto';
import { SearchFilterTask } from './dto/searchFilterTask.dto';
import { TaskEntity } from './tasks.entity';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/auth.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksRepository) private repository: TasksRepository,
    ) {}
    // private tasks: Tasks[] = [];
    // getAllTasks(searchFilterTask: SearchFilterTask): Tasks[] {
    //     const { status, search } = searchFilterTask;
    //     if (status) {
    //         return this.tasks.filter((task) => task.status === status);
    //     }
    //     if (search) {
    //         return this.tasks.filter((task) => {
    //             if (
    //                 task.name.includes(search) ||
    //                 task.description.includes(search)
    //             ) {
    //                 return true;
    //             } else {
    //                 return false;
    //             }
    //         });
    //     }
    //     return this.tasks;
    // }

    getTasks(
        seachFilterTask: SearchFilterTask,
        user: User,
    ): Promise<TaskEntity[]> {
        return this.repository.getTasks(seachFilterTask, user);
    }

    // getATask(id: string): Tasks {
    //     const found = this.tasks.find((task) => {
    //         return task.id === id;
    //     });
    //     if (found) {
    //         return found;
    //     } else {
    //         throw new NotFoundException(`Not Found Task by id: ${id}`);
    //     }
    // }
    async getTaskById(id: string, user: User): Promise<TaskEntity> {
        // try {
        //     const found = await this.repository.findOneOrFail({
        //         where: { id: id, user: user },
        //     });
        //     return found;
        // } catch (err) {
        //     throw new NotFoundException();
        // }
        const found = await this.repository.findOne(null);
        if (found) {
            return found;
        } else {
            throw new NotFoundException(`Not Found Task by id: ${id}`);
        }
    }

    // createTask(taskDTO: createTaskDto): Tasks {
    //     const task: Tasks = {
    //         id: uuid(),
    //         name: taskDTO.name,
    //         description: taskDTO.description,
    //         status: TaskStatus.OPEN,
    //     };
    //     this.tasks.push(task);
    //     return task;
    // }

    createTask(taskDTO: createTaskDto, user: User): Promise<TaskEntity> {
        return this.repository.createTask(taskDTO, user);
    }
    // updateTask(id: string, status: TaskStatus): Tasks {
    //     const task = this.getATask(id);
    //     task.status = status;
    //     return task;
    // }
    async updateTask(
        id: string,
        status: TaskStatus,
        user: User,
    ): Promise<TaskEntity> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await this.repository.save(task);
        return task;
    }

    // deleteTask(id: string): void {
    //     const deleteTask = this.getATask(id);
    //     this.tasks = this.tasks.filter((task) => task.id !== deleteTask.id);
    // }

    async deleteTask(id: string): Promise<void> {
        const numberDeleteTask = await this.repository.delete(id);
        if (numberDeleteTask.affected === 0) {
            throw new NotFoundException(`Not Found Task by id: ${id}`);
        }
    }
}
