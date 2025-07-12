// dto/filter-vehicles.dto.ts
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const FilterVehiclesSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  brand: z.string().optional(),
});

export class FilterVehiclesDto extends createZodDto(FilterVehiclesSchema) {}
