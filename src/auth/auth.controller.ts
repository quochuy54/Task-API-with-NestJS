import {
    Controller,
    Post,
    Body,
    UseGuards,
    Delete,
    Param,
    Res,
    Get,
    Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorator/role.decorator';
import { User } from './auth.entity';
import { AuthService } from './auth.service';
import { CredentialUserDto } from './dto/credentialUser.dto';
import { UpdateAdminDto } from './dto/status-admin.dto';
import { RolesGuard } from './guard/admin.guard';
// import { RolesGuard } from './guard/admin.guard';
// import { AdminGuard } from './guard/admin.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('/signup')
    signUp(@Body() credentialUserDto: CredentialUserDto): Promise<User> {
        return this.authService.singUp(credentialUserDto);
    }

    @Post('/signin')
    async signIn(
        @Body() credentialUserDto: CredentialUserDto,
        @Res({ passthrough: true }) res: any,
        @Req() req,
    ): Promise<{ token: string }> {
        // console.log(req);
        const jwt = await this.authService.signIn(credentialUserDto);
        res.cookie('jwt', jwt);
        return jwt;
    }

    @Post('/updateAdmin/:id')
    @Roles(true)
    @UseGuards(AuthGuard(), RolesGuard)
    // @UseGuards(RolesGuard)
    updateStatusAdmin(
        @Param('id') userId: string,
        @Body() updateAdmin: UpdateAdminDto,
    ) {
        return this.authService.updateStatusAdmin(updateAdmin, userId);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    deleteUser(@Param('id') id: string) {
        return this.authService.deleteUser(id);
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Get('/refreshToken')
    refreshToken(@Req() req: any) {
        const userId = req.user.username;
        const refreshToken = req.user.refreshToken;
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
