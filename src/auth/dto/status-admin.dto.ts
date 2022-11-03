import { IsBoolean, IsString } from 'class-validator';

export class UpdateAdminDto {
    @IsBoolean()
    status: boolean;
}
