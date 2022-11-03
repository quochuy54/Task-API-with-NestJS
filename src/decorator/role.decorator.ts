import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'admin';
export const Roles = (role: boolean) => SetMetadata(ROLES_KEY, role);
