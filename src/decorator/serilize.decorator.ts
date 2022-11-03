import { SerializeInterceptor } from '../interceptor/serialize.interceptor';
import { UseInterceptors } from '@nestjs/common';

export function Serialize(dto: any) {
    return UseInterceptors(new SerializeInterceptor(dto));
}
