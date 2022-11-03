import {
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { UserRepository } from './auth.repository';
import { CredentialUserDto } from './dto/credentialUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { UpdateAdminDto } from './dto/status-admin.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}
    singUp(credentialUserDto: CredentialUserDto): Promise<User> {
        return this.userRepository.createUser(credentialUserDto);
    }

    async signIn(
        credentialUserDto: CredentialUserDto,
    ): Promise<{ token: string; refreshtoken: string }> {
        const user = await this.userRepository.findOne({
            username: credentialUserDto.username,
        });
        if (
            user &&
            (await bcrypt.compare(credentialUserDto.password, user.password))
        ) {
            const payload = { username: user.username };
            const token: string = await this.jwtService.sign(payload, {
                secret: 'mysecret',
                expiresIn: 3600,
            });
            // console.log(token);
            let refreshtoken: string;

            if (!user.refreshtoken) {
                refreshtoken = await this.jwtService.sign(payload, {
                    secret: 'myrefreshtokensecret',
                    expiresIn: 3600 * 24 * 100000,
                });
                user.refreshtoken = refreshtoken;
                await this.userRepository.save(user);
            } else {
                refreshtoken = user.refreshtoken;
            }
            return { token: token, refreshtoken: refreshtoken };
        } else {
            throw new UnauthorizedException('Check your login again');
        }
    }

    async deleteUser(id: string): Promise<string> {
        const user = await this.userRepository.findOne({
            where: { id },
        });
        if (!user) throw new NotFoundException('Not found user to delete');
        this.userRepository.remove(user);
        return 'delete successfuly';
    }

    updateStatusAdmin(updateAdmin: UpdateAdminDto, userId: string) {
        const { status } = updateAdmin;
        return this.userRepository.updateStatusAdmin(status, userId);
    }

    async refreshTokens(username: string, refreshToken: string) {
        const user = await this.userRepository.findOne({
            where: {
                username,
            },
        });

        if (!user) {
            throw new ForbiddenException('Refreshtoken is not valid');
        }

        if (refreshToken !== user.refreshtoken) {
            throw new ForbiddenException('Refreshtoken is not valid');
        }

        const payload = { username: user.username };
        const token: string = await this.jwtService.sign(payload, {
            secret: 'mysecret',
            expiresIn: 3600,
        });

        return { token: token };
    }
}
