import { IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class CredentialUserDto {
    @IsString()
    @MaxLength(32)
    @MinLength(4)
    username: string;

    @IsString()
    @MaxLength(32)
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password is not strong',
    })
    password: string;
}
