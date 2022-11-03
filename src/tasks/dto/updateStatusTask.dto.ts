import { IsEnum } from 'class-validator';
import { TaskStatus } from '../tasks-status.enum';

export class UpdateStatusTasksDTO {
    @IsEnum(TaskStatus)
    status: TaskStatus;
}
