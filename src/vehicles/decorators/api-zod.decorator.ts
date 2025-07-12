import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';

interface QueryParamOptions {
  name: string;
  type: any;
  required?: boolean;
  example?: any;
  description?: string;
}

export function ApiZodQueryParams(dto: any, params: QueryParamOptions[]) {
  const decorators = params.map((param) =>
    ApiQuery({
      name: param.name,
      type: param.type,
      required: param.required ?? false,
      example: param.example,
      description: param.description,
    }),
  );

  return applyDecorators(ApiExtraModels(dto), ...decorators);
}
