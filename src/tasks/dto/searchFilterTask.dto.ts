import { TaskStatus } from '../tasks-status.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class SearchFilterTask {
    @IsOptional()
    @IsEnum(TaskStatus)
    status: TaskStatus;

    @IsOptional()
    @IsString()
    search: string;
}
