import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const CreateImageSchema = z.object({
  url: z.string().url('URL inválida'),
  name: z.string().min(1, 'Nome Obrigatório'),
});
