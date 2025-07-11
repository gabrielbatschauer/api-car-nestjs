import { z } from 'zod';

// Método 2: Schema específico para update (mais controle)
export const UpdateVehicleSchema = z.object({
  brand: z.string().min(1, 'Marca obrigatória').max(50).optional(),
  model: z.string().min(1, 'Modelo obrigatório').max(50).optional(),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional(),
  price: z.number().positive('Valor deve ser positivo').optional(),
  description: z.string().min(10).max(1000).optional(),
});
