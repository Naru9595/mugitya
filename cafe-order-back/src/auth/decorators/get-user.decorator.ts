// src/auth/decorators/get-user.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // ExecutionContextからリクエストオブジェクトを取得
    const request = ctx.switchToHttp().getRequest();
    
    // リクエストオブジェクトからuserプロパティを返却
    return request.user;
  },
);