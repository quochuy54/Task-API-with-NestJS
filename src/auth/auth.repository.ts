import { EntityRepository, Repository } from 'typeorm';
import { User } from './auth.entity';
import { CredentialUserDto } from './dto/credentialUser.dto';
import {
    ConflictException,
    InternalServerErrorException,
    UnauthorizedException,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    constructor(private jwtservice: JwtService) {
        super();
    }
    async createUser(credentialUserDto: CredentialUserDto): Promise<User> {
        const { username, password } = credentialUserDto;
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = this.create({
            username: username,
            password: hashPassword,
        });
        try {
            const user = await this.save(newUser);
            return user;
        } catch (err) {
            // 23505 la ma loi duplicate trong postgreSql
            if (err.code === '23505') {
                throw new ConflictException('Duplicate Username');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async updateStatusAdmin(status: boolean, userId: string) {
        try {
            const user = await this.findOne(userId);
            if (!user)
                throw new NotFoundException(
                    'Not found user to update admin status',
                );
            user.admin = status;
            return this.save(user);
        } catch (err) {
            throw new InternalServerErrorException();
        }
    }

    // Khong the dung JWTService strong repository
    // async signIn(
    //     credentialUserDto: CredentialUserDto,
    // ): Promise<{ token: string }> {
    //     const user = await this.findOne({
    //         username: credentialUserDto.username,
    //     });
    //     if (
    //         user &&
    //         (await bcrypt.compare(credentialUserDto.password, user.password))
    //     ) {
    //         const payload = { usernam: user.username };
    //         try {
    //             const token: string = await this.jwtservice.signAsync(payload);
    //             return { token: token };
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     } else {
    //         throw new UnauthorizedException('Check your login again');
    //     }
    // }
}
