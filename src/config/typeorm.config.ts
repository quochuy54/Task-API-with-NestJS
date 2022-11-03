import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'task-management',
    autoLoadEntities: true,
    // autoLoadEntities: true,
    // entities: ['**/src/tasks/dto/entity/*{.ts,.js}'],
    synchronize: true,
};
