//make custom decorator so that we avoid the usage of "@Req()"
//this is due to Req being bug prone, as well as added utility to call @User for example
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
