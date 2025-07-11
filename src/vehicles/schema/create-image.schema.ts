import z from 'zod';

export const CreateImageSchema = z.object({
  url: z.string().url('URL inválida'),
  description: z.string().nullable().optional(),
});
