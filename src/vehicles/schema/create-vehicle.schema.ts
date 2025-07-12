import { z } from 'zod';
import { CreateImageSchema } from './create-image.schema';

export const CreateVehicleSchema = z.object({
  brand: z.string().min(1, 'Marca obrigatória'),
  model: z.string().min(1, 'Modelo obrigatório'),
  year: z
    .number()
    .int()
    .min(1, 'Ano Obrigatório')
    .refine((val) => val.toString().length === 4, {
      message: 'Ano deve ter exatamente 4 dígitos',
    }),
  price: z.number().min(1, 'Valor obrigatório'),
  description: z.string().optional(),
  images: z.array(CreateImageSchema).optional(),
});
