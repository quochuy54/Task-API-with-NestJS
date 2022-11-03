import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './auth.entity';
import { UserRepository } from './auth.repository';
import { Request } from 'express';

// export const cookieExtractor = function (req) {
//     let token = null;
//     if (req && req.cookies) {
//         token = req.cookies['jwt'];
//     }
//     return token;
// };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({
            secretOrKey: 'mysecret',
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    const data = request?.cookies['jwt'];
                    if (!data) {
                        return null;
                    }
                    return data.token;
                },
            ]),
        });
    }

    async validate(payload: any): Promise<User> {
        const { username } = payload;
        const user: User = await this.userRepository.findOne({
            where: { username },
        });
        if (!user) {
            throw new UnauthorizedException('Login is not valid');
        } else {
            return user;
        }
    }
}
