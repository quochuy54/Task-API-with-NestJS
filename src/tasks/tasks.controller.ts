import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    Req,
    ValidationPipe,
    UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { createTaskDto } from './dto/createTast.dto';
import { TasksService } from './tasks.service';
import { UpdateStatusTasksDTO } from './dto/updateStatusTask.dto';
import { SearchFilterTask } from './dto/searchFilterTask.dto';
import { TaskEntity } from './tasks.entity';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from '../auth/auth.entity';
import { Serialize } from 'src/decorator/serilize.decorator';
import { TaskDto } from './dto/task.dto';

// @Serialize(TaskDto)
@Controller('tasks') // localhost:3000/tasks
export class TasksController {
    constructor(private tasksService: TasksService) {}

    // //Get All Tasks with Filting and Searching
    // @Get()
    // getAllTasks(@Query() seachFilterTask: SearchFilterTask): Tasks[] {
    //     return this.tasksService.getAllTasks(seachFilterTask);
    // }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    getTasks(
        @Query() searchFilterTask: SearchFilterTask,
        @GetUser() user: User,
        // @Req() req: any,
    ): Promise<TaskEntity[]> {
        return this.tasksService.getTasks(searchFilterTask, user);
    }

    // //Get A Task
    // @Get('/:id')
    // getATask(@Param('id') id: string): Tasks {
    //     return this.tasksService.getATask(id);
    // }
    @Get('/:id')
    @UseGuards(AuthGuard())
    getATask(
        @Param('id') id: string,
        @GetUser() user: User,
    ): Promise<TaskEntity> {
        return this.tasksService.getTaskById(id, user);
    }

    // //Add A Task
    // @Post()
    // createTask(@Body() tasksDTO: TasksDTO): Tasks {
    //     return this.tasksService.createTask(tasksDTO);
    // }
    @Post()
    @UseGuards(AuthGuard())
    createTask(
        @Body() taskDTO: createTaskDto,
        @GetUser() user: User,
    ): Promise<TaskEntity> {
        return this.tasksService.createTask(taskDTO, user);
    }

    // // Update Status Task
    // @Patch('/:id')
    // updateTask(
    //     @Param('id') id: string,
    //     @Body() updateStatusTasksDTO: UpdateStatusTasksDTO,
    // ): Tasks {
    //     const { status } = updateStatusTasksDTO;
    //     return this.tasksService.updateTask(id, status);
    // }
    @Patch('/:id')
    @UseGuards(AuthGuard())
    updateTask(
        @Param('id') id: string,
        @Body() updateStatusTasksDTO: UpdateStatusTasksDTO,
        @GetUser() user: User,
    ): Promise<TaskEntity> {
        const { status } = updateStatusTasksDTO;
        return this.tasksService.updateTask(id, status, user);
    }

    // // Delete A Task
    // @Delete(':id')
    // deleteTask(@Param('id') id: string): void {
    //     return this.tasksService.deleteTask(id);
    // }

    @Delete('/:id')
    @UseGuards(AuthGuard())
    deleteTask(@Param('id') id: string): Promise<void> {
        return this.tasksService.deleteTask(id);
    }
}
