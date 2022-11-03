import { Expose, Transform } from 'class-transformer';
import { TaskStatus } from '../tasks-status.enum';
export class TaskDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    status: TaskStatus;

    @Transform(({ obj }) => {
        return obj.user.id;
    })
    userId: string;
}
