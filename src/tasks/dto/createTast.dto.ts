import { IsNotEmpty } from 'class-validator';

export class createTaskDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;
}
