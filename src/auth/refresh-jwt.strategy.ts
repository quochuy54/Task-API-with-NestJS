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
export class RefreshJwtStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({
            secretOrKey: 'myrefreshtokensecret',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true,
        });
    }

    async validate(
        req: Request,
        payload: any,
    ): Promise<{ username: string; refreshToken: string }> {
        const refreshToken = req.headers.authorization
            .replace('Bearer', '')
            .trim();
        const { username } = payload;
        return { username: username, refreshToken: refreshToken };
    }
}
