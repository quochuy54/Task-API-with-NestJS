import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './auth.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { RefreshJwtStrategy } from './refresh-jwt.strategy';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({}),
        TypeOrmModule.forFeature([UserRepository]),
    ],
    providers: [AuthService, JwtStrategy, RefreshJwtStrategy],
    controllers: [AuthController],
    exports: [JwtStrategy, PassportModule, RefreshJwtStrategy],
})
export class AuthModule {}
