import { TaskStatus } from '../tasks-status.enum';

export class UpdateTaskDTO {
    id: string;
    status: TaskStatus;
}
